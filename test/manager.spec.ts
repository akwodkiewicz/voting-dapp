import web3 = require("web3");
import { CategoryContract, ManagerContract } from "./consts";
import { createCategoryName, createVotingOptions } from "./web3helpers";

contract("ManagerContract", async (accounts) => {
    const categoryName = "Xyzzy";

    describe("Starting tests", async () => {
        it("should deploy correctly", async () => {
            const instance = await ManagerContract.deployed();
            expect(instance).to.be.not.null.and.not.undefined;
        });
    });

    describe("Right after deployment", async () => {
        it("throws invalid_opcode error, when accessing empty categoryContractsList", async () => {
            const instance = await ManagerContract.deployed();

            try {
                await instance.categoryContractsList(0);
                assert(false, "This method was supposed to revert, but it didn't");
            } catch (error) {
                assert(error.message.includes("invalid opcode"), `This method reverted with wrong message: ${error}`);
            }
        });

        it("doesn't have a category of a zero address", async () => {
            const instance = await ManagerContract.deployed();
            const addr = "0x0000000000000000000000000000000000000000";
            assert(web3.utils.isAddress(addr), `${addr}`);
            const result = await instance.doesCategoryExist(addr);
            expect(result).to.be.false;
        });

        it("doesn't have a category named 'Xyzzy'", async () => {
            const instance = await ManagerContract.deployed();

            const resultInHex = await instance.categoryAddress(web3.utils.fromAscii("Xyzzy"));
            const result = web3.utils.hexToNumber(resultInHex);
            expect(result).to.be.equal(0);
        });
    });

    describe("User wants to create votings", async () => {
        it("creates a first voting in a new category 'Xyzzy'", async () => {
            const instance = await ManagerContract.deployed();

            const question = "Do you like this question?";
            const result = await instance.createVotingWithNewCategory(
                createCategoryName(categoryName),
                question,
                createVotingOptions(["Yes", "No"]),
                Date.now() + 100,
                Date.now() + 200,
                false,
                [],
                { from: accounts[0] }
            );

            expect(result.logs[0].event).equals("CategoryCreated");
            expect(result.logs[1].event).equals("VotingCreated");

            expect(result.logs[0].args.creator).equals(accounts[0]);
            const xyzzyAddress = await instance.categoryAddress(web3.utils.fromAscii(categoryName));
            expect(result.logs[0].args.categoryAddress).equals(xyzzyAddress);
            expect(web3.utils.hexToString(result.logs[0].args.categoryName)).equals(categoryName);

            const xyzzy = await CategoryContract.at(xyzzyAddress);

            expect(result.logs[1].args.creator).equals(accounts[0]);
            const votingAddress = await xyzzy.votingContracts(0);
            expect(result.logs[1].args.votingAddress).equals(votingAddress);
            expect(result.logs[1].args.question).equals(question);
        });

        it("throws an error, when user tries to create Xyzzy second time", async () => {
            const instance = await ManagerContract.deployed();
            const xyzzyAddress = await instance.categoryAddress(web3.utils.fromAscii(categoryName));
            expect(xyzzyAddress).not.equals(web3.utils.numberToHex(0));

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

        it("creates a second voting in Xyzzy", async () => {
            const instance = await ManagerContract.deployed();
            const xyzzyAddress = await instance.categoryAddress(web3.utils.fromAscii(categoryName));
            const xyzzy = await CategoryContract.at(xyzzyAddress);
            const question = "Did you like first question?";

            const result = await instance.createVotingWithExistingCategory(
                xyzzyAddress,
                question,
                createVotingOptions(["Very much", "A little", "Not at all"]),
                Date.now() + 100,
                Date.now() + 200,
                false,
                [],
                { from: accounts[0] }
            );

            expect(result.logs[0].event).equals("VotingCreated");

            expect(result.logs[0].args.creator).equals(accounts[0]);
            const votingAddress = await xyzzy.votingContracts(1);
            expect(result.logs[0].args.votingAddress).equals(votingAddress);
            expect(result.logs[0].args.question).equals(question);
        });
    });
});
