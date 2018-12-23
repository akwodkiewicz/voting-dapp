import { BlockchainData, Category } from "../components/common/types.js";
import CategoryContract from "../contracts/CategoryContract.json";

export const fetchCategories = async (blockchainData: BlockchainData) => {
    const web3 = blockchainData.web3;
    const managerInstance = blockchainData.manager;

    const categories: Category[] = [];
    const numberOfCategories = await managerInstance.methods.numberOfCategories().call();
    if (numberOfCategories.length > 0) {
        for (let index = 0; index < numberOfCategories; index++) {
            const categoryAddress = await managerInstance.methods.categoryContractsList(index).call();
            const categoryContract = new web3.eth.Contract(CategoryContract.abi, categoryAddress);
            const categoryName = web3.utils.toUtf8(await categoryContract.methods.categoryName().call());
            categories.push({ name: categoryName, address: categoryAddress });
        }
    }
    return categories;
};
