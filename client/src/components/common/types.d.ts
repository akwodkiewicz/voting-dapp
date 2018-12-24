import Web3 = require("web3");
import { ManagerContract } from "../../typed-contracts/ManagerContract";
import { VotingContract } from "../../typed-contracts/VotingContract";
import { CategoryPanelType } from "../createVote/CategoryPanel";
import { Voter, VoteType } from "../createVote/VoteTypePanel";

export declare type ContractAddress = string;

export declare type BlockchainData = {
    manager: ManagerContract;
    accounts: string[];
    web3: Web3;
};

export declare type Category = {
    address: ContractAddress;
    name: string;
};

export declare type Voting = {
    contract: VotingContract;
    question: string;
};

// tslint:disable-next-line:interface-name
export declare interface VoteFormData {
    question: string;
    answers: string[];
    voteEndTime: number;
    resultsViewingEndTime: number;
    categoryPanel: CategoryPanelType;
    chosenCategory: string | ContractAddress;
    voteType: VoteType;
    privilegedVoters: Voter[];
}
