import Web3 = require("web3");
import { createCategoryName, createVotingOptions, decodeVotingOption } from "../app/web3helpers";
import { CategoryContractInstance, ManagerContractInstance, VotingContractInstance } from "../types/truffle-contracts";
import { CategoryContract, ManagerContract, VotingContract } from "./consts";

const web3 = new Web3(Web3.givenProvider);

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
        const question = "Pick your favourite l€tt€rs";
        const options = ["A", "⡎", "ቢ", "ᚻᛖ", "Δ", "؂", "ひらがな", "H", "I", "J"];
        const userOneOption = 4;
        const userTwoOption = 7;

        before(async () => {
            const createVotingTxResp = await managerInstance.createVotingWithNewCategory(
                createCategoryName(categoryName),
                question,
                createVotingOptions(options),
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
                    web3.currentProvider.send(
                        {
                            id: 0,
                            jsonrpc: "2.0",
                            method: "evm_mine",
                            params: [],
                        },
                        () => undefined
                    );
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

        describe("#viewContractInfo", async () => {
            it("returns correct contract info (using UTF-8)", async () => {
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
    });
});
