import { createCategoryName, createVotingOptions, decodeVotingOption, mineEmptyBlock } from "../app/web3helpers";
import { CategoryContractInstance, ManagerContractInstance, VotingContractInstance } from "../types/truffle-contracts";
import { CategoryContract, ManagerContract, VotingContract } from "./consts";

contract("VotingContract", async (accounts) => {
    let managerInstance: ManagerContractInstance;
    let categoryInstance: CategoryContractInstance;
    const categoryName = "FizzBuzz";

    before(async () => {
        managerInstance = await ManagerContract.deployed();
        expect(managerInstance).to.be.not.null.and.not.undefined;
    });

    context("In a public voting with 10 options", async () => {
        let votingContract: VotingContractInstance;
        const votingEndTime = Math.floor(Date.now() / 1000) + 23;
        const resultsEndTime = votingEndTime + 21;

        const userOneOption = 4;
        const userTwoOption = 7;

        before(async () => {
            const createVotingTxResp = await managerInstance.createVotingWithNewCategory(
                createCategoryName(categoryName),
                "Pick your favourite letter",
                createVotingOptions(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]),
                votingEndTime,
                resultsEndTime,
                false,
                [],
                { from: accounts[0] }
            );
            expect(createVotingTxResp.logs[0].event).equals("CategoryCreated");
            expect(createVotingTxResp.logs[1].event).equals("VotingCreated");
            categoryInstance = await CategoryContract.at(createVotingTxResp.logs[0].args.categoryAddress);
            expect(categoryInstance).to.be.not.null.and.not.undefined;
            const votingAddress: string = createVotingTxResp.logs[1].args.votingAddress;
            votingContract = await VotingContract.at(votingAddress);
            expect(votingContract).to.be.not.null.and.not.undefined;
        });

        describe("#isPrivate", async () => {
            it("returns false", async () => {
                const isPrivate = await votingContract.isPrivate();
                expect(isPrivate).to.equal(false);
            });
        });

        describe("#numberOfOptions", async () => {
            it("returns 10", async () => {
                const numberOfOptions = await votingContract.numberOfOptions();
                expect(numberOfOptions.toNumber()).to.equal(10);
            });
        });

        describe("#vote", async () => {
            const userOne = accounts[0];
            const userTwo = accounts[1];
            context("when user #1 votes for the first time", async () => {
                it("does not throw", async () => {
                    await votingContract.vote(userOneOption, { from: userOne });
                });
            });

            context("when user #1 tries to vote second time for the same option", async () => {
                it("reverts with right message", async () => {
                    try {
                        await votingContract.vote(userOneOption, {
                            from: userOne,
                        });
                        assert(false, "This method was supposed to revert, but it didn't");
                    } catch (error) {
                        assert(
                            error.reason === "You have already voted",
                            `This method reverted with wrong message: ${error}`
                        );
                    }
                });
            });

            context("when user #1 tries to vote second time for another option", async () => {
                it("reverts with right message", async () => {
                    try {
                        await votingContract.vote(userTwoOption, {
                            from: userOne,
                        });
                        assert(false, "This method was supposed to revert, but it didn't");
                    } catch (error) {
                        assert(
                            error.reason === "You have already voted",
                            `This method reverted with wrong message: ${error}`
                        );
                    }
                });
            });

            context("when user #2 votes for the first time", async () => {
                it("does not throw", async () => {
                    await votingContract.vote(userTwoOption, { from: userTwo });
                });
            });
        });

        describe("#viewVotes", async () => {
            context("when it's too early to see the votes", async () => {
                assert(Math.floor(Date.now() / 1000) < votingEndTime);

                it("reverts with right message", async () => {
                    try {
                        await votingContract.viewVotes();
                        assert(false, "This method was supposed to revert, but it didn't");
                    } catch (error) {
                        assert(
                            error.message.includes("It's too early to see the votes"),
                            `This method reverted with wrong message: ${error}`
                        );
                    }
                });
            });

            context("when votingEndTime has passed", async () => {
                before(async () => {
                    // Wait till votingEndtime
                    while (Math.floor(Date.now() / 1000) < votingEndTime);

                    // Mine an empty block to bump the latest block timestamp
                    await mineEmptyBlock();
                });

                it("returns correct voting results", async () => {
                    const votingResults = await votingContract.viewVotes();
                    const votingResultsNumbers = votingResults.map((big) => big.toNumber());

                    votingResultsNumbers.forEach((num, idx) => {
                        if (idx === userOneOption || idx === userTwoOption) {
                            expect(num).to.equal(1);
                        } else {
                            expect(num).to.equal(0);
                        }
                    });
                });
            });
        });
    });

    context("In a private voting with 5 UTF-8 options", async () => {
        let votingContract: VotingContractInstance;
        let votingEndTime: number;
        let resultsEndTime: number;
        const options = ["Ą", "Ź", "🍿", "Ḽơᶉëᶆ", "ひほわれよう"];
        const question = "Pick your favourite string";

        before(async () => {
            votingEndTime = Math.floor(Date.now() / 1000) + 23;
            resultsEndTime = votingEndTime + 21;
            const createVotingTxResp = await managerInstance.createVotingWithExistingCategory(
                categoryInstance.address,
                question,
                createVotingOptions(options),
                votingEndTime,
                resultsEndTime,
                true,
                [accounts[0], accounts[1], accounts[2]],
                { from: accounts[0] }
            );
            const logs = createVotingTxResp.logs;
            expect(logs).length(1);
            expect(logs[0].event).equals("VotingCreated");
            const votingAddress: string = logs[0].args.votingAddress;
            votingContract = await VotingContract.at(votingAddress);
            expect(votingContract).to.be.not.null.and.not.undefined;
        });

        describe("#isPrivate", async () => {
            it("returns true", async () => {
                const isPrivate = await votingContract.isPrivate();
                assert(isPrivate);
            });
        });

        describe("#numberOfOptions", async () => {
            it("returns 5", async () => {
                const numberOfOptions = await votingContract.numberOfOptions();
                assert(numberOfOptions.toNumber() === 5);
            });
        });

        describe("#options", async () => {
            it("returns every option correctly", async () => {
                for (let index = 0; index < 5; index++) {
                    const returnedOption = await votingContract.options(index);
                    const option = decodeVotingOption(returnedOption);
                    assert(option === options[index], `Returned: ${option} Expected: ${options[index]}`);
                }
            });
        });

        describe("#hasPermission", async () => {
            it("returns true for permitted users", async () => {
                for (let index = 0; index < 3; index++) {
                    const hasPermission = await votingContract.hasPermission(accounts[index]);
                    assert(hasPermission);
                }
            });

            it("returns false for not permitted users", async () => {
                for (let index = 3; index < 10; index++) {
                    const hasPermission = await votingContract.hasPermission(accounts[index]);
                    assert(!hasPermission);
                }
            });
        });

        describe("#viewContractInfo", async () => {
            it("returns correct contract info", async () => {
                const result = await votingContract.viewContractInfo();
                const rawQuestion = result[0];
                const rawCategory = result[1];
                const rawOptions = result[2];
                const rawVotingEndTime = result[3];
                const rawResultsEndTime = result[4];

                expect(rawQuestion).equals(question);
                expect(rawCategory).equals(categoryInstance.address);
                const decodedOptions = rawOptions.map(decodeVotingOption);
                expect(decodedOptions).to.deep.equal(options);
                expect(rawVotingEndTime.toNumber()).equals(votingEndTime);
                expect(rawResultsEndTime.toNumber()).equals(resultsEndTime);
            });
        });

        describe("#vote", async () => {
            context("when user has permission", async () => {
                it("allows to vote", async () => {
                    await votingContract.vote(0, { from: accounts[0] });
                    await votingContract.vote(0, { from: accounts[1] });
                    await votingContract.vote(4, { from: accounts[2] });
                });
            });

            context("when user doesn't have permission", async () => {
                it("reverts with the right message", async () => {
                    try {
                        await votingContract.vote(4, { from: accounts[3] });
                        assert(false, "This method was supposed to revert, but it didn't");
                    } catch (error) {
                        assert(
                            error.reason === "You don't have voting permission",
                            `This method reverted with wrong message: ${error.reason}`
                        );
                    }
                });
            });
        });

        describe("#viewVotes", async () => {
            context("when votingEndTime passed", async () => {
                before(async () => {
                    // Wait till votingEndtime
                    while (Math.floor(Date.now() / 1000) < votingEndTime);

                    //// Mining throws: "Error: Could not connect to your Ethereum client."
                    //// Moreover, not mining is sufficient...?
                    // await mineEmptyBlock();
                });

                it("returns correct voting results", async () => {
                    const votingResults = await votingContract.viewVotes({ from: accounts[1] });
                    const votingResultsNumbers = votingResults.map((big) => big.toNumber());

                    expect(votingResultsNumbers[0]).equals(2);
                    expect(votingResultsNumbers[4]).equals(1);
                    [1, 2, 3].forEach((num) => expect(votingResultsNumbers[num]).equals(0));
                });
            });
        });
    });
});
