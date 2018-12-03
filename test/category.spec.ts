import truffleAssert = require("truffle-assertions");
import web3 = require("web3");
import { CategoryContractInstance, ManagerContractInstance } from "../types/truffle-contracts";
import { CategoryContract, ManagerContract, VotingContract } from "./consts";

contract("CategoryContract", async (accounts) => {
    let managerInstance: ManagerContractInstance;
    let categoryInstance: CategoryContractInstance;
    const categoryName = "Foobar";

    before(async () => {
        managerInstance = await ManagerContract.deployed();
        expect(managerInstance).to.be.not.null.and.not.undefined;

        const createVotingTxResp = await managerInstance.createVotingWithNewCategory(
            categoryName,
            "Example question",
            ["Answer 1", "Answer 2", "Answer 3"],
            Date.now() + 1000,
            Date.now() + 1020,
            false,
            [], { from: accounts[0] });
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

        it("throws when accessing second item in array", async () => {
            await truffleAssert.fails(categoryInstance.votingContracts(1),
                truffleAssert.ErrorType.INVALID_OPCODE);
        });
    });

    describe("When adding second voting", async () => {

        it("reverts when voting is not created via ManagerContract", async () => {
            await truffleAssert.fails(
                categoryInstance.createVotingContract(
                    "Second question",
                    ["Opt1", "Opt2"],
                    Date.now() + 100,
                    Date.now() + 200,
                    false,
                    [],
                    { from: accounts[0] }),
                truffleAssert.ErrorType.REVERT);
        });
    });

    describe("After adding second voting", async () => {

        before(async () => {
            const createVotingTxResp = await managerInstance.createVotingWithExistingCategory(
                categoryInstance.address,
                "Example question no 2",
                ["Answer A", "Answer B", "Answer C"],
                Date.now() + 1000,
                Date.now() + 1020,
                false,
                [], { from: accounts[0] });
            expect(createVotingTxResp.logs[0].event).equals("VotingCreated");
        });

        it("returns info about 2 votings", async () => {
            const numberOfVotings = await categoryInstance.numberOfContracts();
            expect(numberOfVotings.toNumber()).equals(2);

            const votingOneAddr = await categoryInstance.votingContracts(0);
            const votingOne = await VotingContract.at(votingOneAddr);
            expect(votingOne).is.not.null;
            const votingTwoAddr = await categoryInstance.votingContracts(1);
            const votingTwo = await VotingContract.at(votingTwoAddr);
            expect(votingTwo).is.not.null;
        });
    });

});
