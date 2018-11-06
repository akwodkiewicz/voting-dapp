const ManagerContract = artifacts.require('ManagerContract');

contract('ManagerContract', async (accounts) => {
    let contract;
    let creatorAccount = accounts[0];

    beforeEach(async () => {
        contract = await ManagerContract.new({from: creatorAccount});
        expect(contract).to.not.be.null.and.to.not.be.undefined;
    })

    it('should deploy correctly', async () => {
        let instance = await ManagerContract.deployed();
        expect(instance).be.not.undefined.and.not.null;
    });

});