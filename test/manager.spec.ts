import truffleAssert = require("truffle-assertions");
import web3 = require("web3");
import { CategoryContract, ManagerContract } from "./consts";

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

            await truffleAssert.fails(
                instance.categoryContractsList(0),
                truffleAssert.ErrorType.INVALID_OPCODE,
            );
        });

        it("doesn't have a category of address '0x00000000'", async () => {
            const instance = await ManagerContract.deployed();

            const result = await instance.doesCategoryExist("0x00000000");
            expect(result).to.be.false;
        });

        it("doesn't have a category named 'Xyzzy'", async () => {
            const instance = await ManagerContract.deployed();

            const resultInHex = await instance.categoryAddress("Xyzzy");
            const result = web3.utils.hexToNumber(resultInHex);
            expect(result).to.be.equal(0);
        });
    });

    describe("User wants to create votings", async () => {

        it("creates a first voting in a new category 'Xyzzy'", async () => {
            const instance = await ManagerContract.deployed();

            const question = "Do you like this question?";
            const result = await instance.createVotingWithNewCategory(
                categoryName,
                question,
                ["Yes", "No"],
                Date.now() + 100,
                Date.now() + 200,
                false,
                [], { from: accounts[0] });

            expect(result.logs[0].event).equals("CategoryCreated");
            expect(result.logs[1].event).equals("VotingCreated");

            expect(result.logs[0].args.creator).equals(accounts[0]);
            const xyzzyAddress = await instance.categoryAddress(categoryName);
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
            const xyzzyAddress = await instance.categoryAddress(categoryName);
            expect(xyzzyAddress).not.equals(web3.utils.numberToHex(0));

            await truffleAssert.fails(instance.createVotingWithNewCategory(
                categoryName,
                "Do you like this question?",
                ["Yes", "No"],
                Date.now() + 100,
                Date.now() + 200,
                false,
                [], { from: accounts[0] }),
                truffleAssert.ErrorType.REVERT,
            );
        });

        it("creates a second voting in Xyzzy", async () => {
            const instance = await ManagerContract.deployed();
            const xyzzyAddress = await instance.categoryAddress(categoryName);
            const xyzzy = await CategoryContract.at(xyzzyAddress);
            const question = "Did you like first question?";

            const result = await instance.createVotingWithExistingCategory(
                xyzzyAddress,
                question,
                ["Very much", "A little", "Not at all"],
                Date.now() + 100,
                Date.now() + 200,
                false,
                [], { from: accounts[0] });

            expect(result.logs[0].event).equals("VotingCreated");

            expect(result.logs[0].args.creator).equals(accounts[0]);
            const votingAddress = await xyzzy.votingContracts(1);
            expect(result.logs[0].args.votingAddress).equals(votingAddress);
            expect(result.logs[0].args.question).equals(question);
        });

    });
});
