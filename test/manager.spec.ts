import web3 = require("web3");
import { CategoryContractInstance, ManagerContractInstance } from "../types/truffle-contracts";
import { CategoryContract, ManagerContract, VotingContract } from "./consts";
import { createCategoryName, createVotingOptions } from "./web3helpers";

contract("ManagerContract", async (accounts) => {
    const categoryName = "Xyzzy";

    describe("Starting tests", async () => {
        it("should deploy correctly", async () => {
            const instance = await ManagerContract.deployed();
            expect(instance).to.be.not.null.and.not.undefined;
        });
    });

    context("Right after deployment", async () => {
        describe("#categoryContractsList(0)", async () => {
            it("throws invalid_opcode error", async () => {
                const instance = await ManagerContract.deployed();
                try {
                    await instance.categoryContractsList(0);
                    assert(false, "This method was supposed to revert, but it didn't");
                } catch (error) {
                    assert(
                        error.message.includes("invalid opcode"),
                        `This method reverted with wrong message: ${error}`
                    );
                }
            });
        });

        describe("#doesCategoryExist(0x0)", async () => {
            it("returns false", async () => {
                const instance = await ManagerContract.deployed();
                const addr = "0x0000000000000000000000000000000000000000";
                assert(web3.utils.isAddress(addr), `${addr}`);
                const result = await instance.doesCategoryExist(addr);
                expect(result).to.be.false;
            });
        });

        describe("#categoryAddress('Xyzzy')", async () => {
            it("returns 0", async () => {
                const instance = await ManagerContract.deployed();
                const resultInHex = await instance.categoryAddress(web3.utils.fromAscii("Xyzzy"));
                const result = web3.utils.hexToNumber(resultInHex);
                expect(result).to.be.equal(0);
            });
        });
    });

    describe("#createVotingWithNewCategory", async () => {
        context("when user wants to create first voting", async () => {
            const question = "Do you like this question?";
            let instance: ManagerContractInstance;
            let txResp: Truffle.TransactionResponse;

            // Due to complex function behaviour it's executed once in 'before' block
            before(async function createVoting() {
                instance = await ManagerContract.deployed();

                txResp = await instance.createVotingWithNewCategory(
                    createCategoryName(categoryName),
                    question,
                    createVotingOptions(["Yes", "No"]),
                    Date.now() + 100,
                    Date.now() + 200,
                    false,
                    [],
                    { from: accounts[0] }
                );
            });

            it("creates first category", async () => {
                const xyzzyAddress = await instance.categoryAddress(web3.utils.fromAscii(categoryName));
                const xyzzy = await CategoryContract.at(xyzzyAddress);
                expect(xyzzy).to.not.be.null.and.not.undefined;
            });

            it("creates first voting", async () => {
                const xyzzyAddress = await instance.categoryAddress(web3.utils.fromAscii(categoryName));
                const xyzzy = await CategoryContract.at(xyzzyAddress);
                const votingAddress = await xyzzy.votingContracts(0);
                const voting = await VotingContract.at(votingAddress);
                expect(voting).to.not.be.null.and.not.undefined;
            });

            it("emits 'CategoryCreated' event correctly as the first event in log", async () => {
                expect(txResp.logs[0].event).equals("CategoryCreated");
                expect(txResp.logs[0].args.creator).equals(accounts[0]);
                const xyzzyAddress = await instance.categoryAddress(web3.utils.fromAscii(categoryName));
                expect(txResp.logs[0].args.categoryAddress).equals(xyzzyAddress);
                expect(web3.utils.hexToString(txResp.logs[0].args.categoryName)).equals(categoryName);
            });

            it("emits 'VotingCreated' event correctly as the second event in log", async () => {
                expect(txResp.logs[1].event).equals("VotingCreated");
                expect(txResp.logs[1].args.creator).equals(accounts[0]);
                const xyzzyAddress = await instance.categoryAddress(web3.utils.fromAscii(categoryName));
                const xyzzy = await CategoryContract.at(xyzzyAddress);
                const votingAddress = await xyzzy.votingContracts(0);
                expect(txResp.logs[1].args.votingAddress).equals(votingAddress);
                expect(txResp.logs[1].args.question).equals(question);
            });
        });

        context("when user tries to create voting in existing category", async () => {
            let instance: ManagerContractInstance;

            before(async () => {
                instance = await ManagerContract.deployed();
                const xyzzyAddress = await instance.categoryAddress(web3.utils.fromAscii(categoryName));
                expect(xyzzyAddress).not.equals(web3.utils.numberToHex(0));
            });

            it("rejects with correct message", async () => {
                try {
                    await instance.createVotingWithNewCategory(
                        createCategoryName(categoryName),
                        "Do you like this question?",
                        createVotingOptions(["Yes", "No"]),
                        Date.now() + 100,
                        Date.now() + 200,
                        false,
                        [],
                        { from: accounts[0] }
                    );
                    assert(false, "This method was supposed to revert, but it didn't");
                } catch (error) {
                    assert(
                        error.reason === "This category name is already used",
                        `This method reverted with wrong reason: ${error}`
                    );
                }
            });
        });
    });

    describe("#createVotingWithExistingCategory", async () => {
        context("when user tries to create a second voting in existing category", async () => {
            const question = "Did you like first question?";
            let manager: ManagerContractInstance;
            let xyzzy: CategoryContractInstance;
            let txResp: Truffle.TransactionResponse;

            // Due to complex function behaviour it's executed once in 'before' block
            before(async function createVoting() {
                manager = await ManagerContract.deployed();
                const xyzzyAddress = await manager.categoryAddress(web3.utils.fromAscii(categoryName));
                xyzzy = await CategoryContract.at(xyzzyAddress);
                expect((await xyzzy.numberOfContracts()).toNumber()).equals(1);

                txResp = await manager.createVotingWithExistingCategory(
                    xyzzyAddress,
                    question,
                    createVotingOptions(["Very much", "A little", "Not at all"]),
                    Date.now() + 100,
                    Date.now() + 200,
                    false,
                    [],
                    { from: accounts[0] }
                );
            });

            it("creates a second voting in existing category", async () => {
                const votingAddress = await xyzzy.votingContracts(1);
                const voting = await VotingContract.at(votingAddress);
                expect(voting).to.not.be.null.and.not.undefined;
            });

            it("emits 'VotingCreated' event correctly", async () => {
                expect(txResp.logs[0].event).equals("VotingCreated");
                expect(txResp.logs[0].args.creator).equals(accounts[0]);
                const votingAddress = await xyzzy.votingContracts(1);
                expect(txResp.logs[0].args.votingAddress).equals(votingAddress);
                expect(txResp.logs[0].args.question).equals(question);
            });
        });
    });
});
