import web3 = require("web3");
import { CategoryContractInstance, ManagerContractInstance } from "../types/truffle-contracts";
import { CategoryContract, ManagerContract, VotingContract } from "./consts";
import { createCategoryName, createVotingOptions } from "./web3helpers";

contract("CategoryContract", async (accounts) => {
    let managerInstance: ManagerContractInstance;
    let categoryInstance: CategoryContractInstance;
    const categoryName = "Foobar";

    before(async () => {
        managerInstance = await ManagerContract.deployed();
        expect(managerInstance).to.be.not.null.and.not.undefined;

        const createVotingTxResp = await managerInstance.createVotingWithNewCategory(
            createCategoryName(categoryName),
            "Example question",
            createVotingOptions(["Answer 1", "Answer 2", "Answer 3"]),
            Date.now() + 1000,
            Date.now() + 1020,
            false,
            [],
            { from: accounts[0] }
        );
        expect(createVotingTxResp.logs[0].event).equals("CategoryCreated");
        expect(createVotingTxResp.logs[1].event).equals("VotingCreated");
        categoryInstance = await CategoryContract.at(createVotingTxResp.logs[0].args.categoryAddress);
        expect(categoryInstance).to.be.not.null.and.not.undefined;
    });

    describe("When added only initial voting", async () => {
        it("returns valid name", async () => {
            const returnedHexName = await categoryInstance.categoryName();
            const returnedName = web3.utils.hexToString(returnedHexName);
            expect(returnedName).equals(categoryName);
        });

        it("number of existing votings equals 1", async () => {
            const returnedBigNumber = await categoryInstance.numberOfContracts();
            const returnedNumber = returnedBigNumber.toNumber();
            expect(returnedNumber).equals(1);
        });

        it("voting is stored as first item in array", async () => {
            const returnedVotingAddress = await categoryInstance.votingContracts(0);
            const votingInstance = VotingContract.at(returnedVotingAddress);
            expect(votingInstance).to.be.not.null.and.not.undefined;
        });

        it("throws invalid_opcode error when accessing second item in array", async () => {
            try {
                await categoryInstance.votingContracts(1);
                assert(false, "This method was supposed to revert, but it didn't");
            } catch (error) {
                assert(error.message.includes("invalid opcode"), `This method reverted with wrong message: ${error}`);
            }
        });
    });

    describe("When adding second voting", async () => {
        it("reverts when voting is not created via ManagerContract", async () => {
            try {
                await categoryInstance.createVotingContract(
                    "Second question",
                    createVotingOptions(["Opt1", "Opt2"]),
                    Date.now() + 100,
                    Date.now() + 200,
                    false,
                    [],
                    { from: accounts[0] }
                );
                assert(false, "This method was supposed to revert, but it didn't");
            } catch (error) {
                assert(
                    error.reason === "Only the ManagerContract is authorised to create a new voting",
                    `This method reverted with wrong reason: ${error}`
                );
            }
        });
    });

    describe("After adding second voting", async () => {
        before(async () => {
            const createVotingTxResp = await managerInstance.createVotingWithExistingCategory(
                categoryInstance.address,
                "Example question no 2",
                createVotingOptions(["Answer A", "Answer B", "Answer C", "D"]),
                Date.now() + 1000,
                Date.now() + 1020,
                false,
                [],
                { from: accounts[0] }
            );
            expect(createVotingTxResp.logs[0].event).equals("VotingCreated");
        });

        it("returns info about 2 votings", async () => {
            const numberOfVotings = await categoryInstance.numberOfContracts();
            expect(numberOfVotings.toNumber()).equals(2);

            const votingOneAddr = await categoryInstance.votingContracts(0);
            const votingOne = await VotingContract.at(votingOneAddr);
            expect(votingOne).is.not.null;
            expect((await votingOne.numberOfOptions()).toNumber()).to.equal(3);
            expect(await votingOne.category()).to.equal(categoryInstance.address);
            expect(await votingOne.question()).to.equal("Example question");
            expect(web3.utils.hexToString(await votingOne.options(0))).to.equal("Answer 1");
            expect(web3.utils.hexToString(await votingOne.options(1))).to.equal("Answer 2");
            expect(web3.utils.hexToString(await votingOne.options(2))).to.equal("Answer 3");

            const votingTwoAddr = await categoryInstance.votingContracts(1);
            const votingTwo = await VotingContract.at(votingTwoAddr);
            expect(votingTwo).is.not.null;
            expect((await votingTwo.numberOfOptions()).toNumber()).to.equal(4);
            expect(await votingTwo.category()).to.equal(categoryInstance.address);
            expect(await votingTwo.question()).to.equal("Example question no 2");
            expect(web3.utils.hexToString(await votingTwo.options(0))).to.equal("Answer A");
            expect(web3.utils.hexToString(await votingTwo.options(1))).to.equal("Answer B");
            expect(web3.utils.hexToString(await votingTwo.options(2))).to.equal("Answer C");
            expect(web3.utils.hexToString(await votingTwo.options(3))).to.equal("D");
        });
    });
});
