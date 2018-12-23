import Web3 = require("web3");
import Contract from "web3/eth/contract"; // tslint:disable-line

declare type ContractAddress = string;

declare type BlockchainData = {
    manager: Contract;
    accounts: string[];
    web3: Web3;
};

export { BlockchainData, ContractAddress };
