import CategoryContract from "../build/contracts/CategoryContract.json";

/**
 *  @class Category
 *  @type {Object}
 *  @property {string} name Category name.
 *  @property {string} address Category address on blockchain.
 */
class Category {
  name;
  address;
}

const fetchCategories = async (blockchainData) => {
  const web3 = blockchainData.web3;
  const managerInstance = blockchainData.manager;

  let categories = [];
  const numberOfCategories = await managerInstance.methods.numberOfCategories().call();
  if (numberOfCategories.length > 0) {
    for (let index = 0; index < numberOfCategories; index++) {
      const categoryAddress = await managerInstance.methods.categoryContractsList(index).call();
      const categoryContract = new web3.eth.Contract(CategoryContract.abi, categoryAddress);
      const categoryName = web3.utils.toUtf8(await categoryContract.methods.categoryName().call());
      categories.push(new Category({ name: categoryName, address: categoryAddress }));
    }
  }
  return categories;
};

export { fetchCategories };
