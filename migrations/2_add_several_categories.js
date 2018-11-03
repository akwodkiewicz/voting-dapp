var CategoryContract = artifacts.require("./CategoryContract.sol");

module.exports = function (deployer) {
  for (categoryName in ["Technology", "Politics", "Education", "Sport", "Food"]) {
    deployer.deploy(CategoryContract, categoryName, "", [], 0, 0, false, []);
  }
};
