import { BlockchainData, Category, Voting } from "../components/common/types.js";
import CategoryAbi from "../contracts/CategoryContract.json";
import VotingAbi from "../contracts/VotingContract.json";
import { CategoryContract } from "../typed-contracts/CategoryContract";
import { ManagerContract } from "../typed-contracts/ManagerContract";
import { VotingContract } from "../typed-contracts/VotingContract";

export const fetchCategories = async (blockchainData: BlockchainData) => {
    const web3 = blockchainData.web3;
    const managerInstance = blockchainData.manager as ManagerContract;

    const categories: Category[] = [];
    const numberOfCategories = parseInt(await managerInstance.methods.numberOfCategories().call(), 10);

    for (let index = 0; index < numberOfCategories; index++) {
        const categoryAddress = await managerInstance.methods.categoryContractsList(index).call();
        const categoryContract = new web3.eth.Contract(CategoryAbi.abi, categoryAddress) as CategoryContract;
        const categoryName = web3.utils.toUtf8(await categoryContract.methods.categoryName().call());
        categories.push({ name: categoryName, address: categoryAddress });
    }

    return categories;
};

export const fetchVotings = async (blockchainData: BlockchainData, category: Category) => {
    const web3 = blockchainData.web3;
    const categoryInstance = new web3.eth.Contract(CategoryAbi.abi, category.address) as CategoryContract;

    const votings: Voting[] = [];
    const numberOfVotings = parseInt(await categoryInstance.methods.numberOfContracts().call(), 10);
    for (let index = 0; index < numberOfVotings; index++) {
        const votingAddress = await categoryInstance.methods.votingContracts(index).call();
        const votingInstance = new web3.eth.Contract(VotingAbi.abi, votingAddress) as VotingContract;
        const question = await votingInstance.methods.question().call();
        votings.push({ contract: votingInstance, question });
    }
    return votings;
};
