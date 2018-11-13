const ManagerContract = artifacts.require('ManagerContract');
const CategoryContract = artifacts.require('CategoryContract');
const truffleAssert = require('truffle-assertions');
const web3 = require('web3');

contract('ManagerContract', async (accounts) => {

    let categoryName = 'Xyzzy';

    describe('Starting tests', async () => {
        it('should deploy correctly', async () => {
            let instance = await ManagerContract.deployed();
            expect(instance).to.be.not.null.and.not.undefined;
        });
    });

    describe('Right after deployment', async () => {

        it('throws invalid_opcode error, when accessing empty categoryContractsList', async () => {
            let instance = await ManagerContract.deployed();

            await truffleAssert.fails(
                instance.categoryContractsList(0),
                truffleAssert.ErrorType.INVALID_OPCODE
            );
        });

        it("doesn't have a category of address '0x00000000'", async () => {
            let instance = await ManagerContract.deployed();

            let result = await instance.doesCategoryExist("0x00000000");
            expect(result).to.be.false;
        });

        it("doesn't have a category named 'Xyzzy'", async () => {
            let instance = await ManagerContract.deployed();

            let resultInHex = await instance.categoryAddress("Xyzzy");
            let result = web3.utils.hexToNumber(resultInHex);
            expect(result).to.be.equal(0);
        });
    });

    describe("User wants to create votings", async () => {

        it("creates a first voting in a new category 'Xyzzy'", async () => {
            let instance = await ManagerContract.deployed();

            let question = "Do you like this question?";
            let result = await instance.createVotingWithNewCategory(
                categoryName,
                question,
                ["Yes", "No"],
                Date.now() + 100,
                Date.now() + 200,
                false,
                [], { from: accounts[0] });

            expect(result.logs[0].event).equals('CategoryCreated');
            expect(result.logs[1].event).equals('VotingCreated');

            expect(result.logs[0].args['creator']).equals(accounts[0]);
            let xyzzyAddress = await instance.categoryAddress(categoryName);
            expect(result.logs[0].args['categoryAddress']).equals(xyzzyAddress);
            expect(web3.utils.hexToString(result.logs[0].args['categoryName'])).equals(categoryName);
            
            let xyzzy = await CategoryContract.at(xyzzyAddress);

            expect(result.logs[1].args['creator']).equals(accounts[0]);
            let votingAddress = await xyzzy.votingContracts(0);
            expect(result.logs[1].args['votingAddress']).equals(votingAddress);
            expect(result.logs[1].args['question']).equals(question);
        });

        it("throws an error, when user tries to create Xyzzy second time", async () => {
            let instance = await ManagerContract.deployed();
            let xyzzyAddress = await instance.categoryAddress(categoryName);
            expect(xyzzyAddress).not.equals(web3.utils.numberToHex(0));

            await truffleAssert.fails(instance.createVotingWithNewCategory(
                categoryName,
                "Do you like this question?",
                ["Yes", "No"],
                Date.now() + 100,
                Date.now() + 200,
                false,
                [], { from: accounts[0] }),
                truffleAssert.ErrorType.REVERT
            );
        });

        it("creates a second voting in Xyzzy", async () => {
            let instance = await ManagerContract.deployed();
            let xyzzyAddress = await instance.categoryAddress(categoryName);
            let xyzzy = await CategoryContract.at(xyzzyAddress);
            let question = "Did you like first question?"

            let result = await instance.createVotingWithExistingCategory(
                xyzzyAddress,
                question,
                ["Very much", "A little", "Not at all"],
                Date.now() + 100,
                Date.now() + 200,
                false,
                [], { from: accounts[0] });

            expect(result.logs[0].event).equals('VotingCreated');

            expect(result.logs[0].args['creator']).equals(accounts[0]);
            let votingAddress = await xyzzy.votingContracts(1);
            expect(result.logs[0].args['votingAddress']).equals(votingAddress);
            expect(result.logs[0].args['question']).equals(question);
        });
    });
});