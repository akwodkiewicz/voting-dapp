import Web3 = require("web3");
import { CategoryPanelType } from "../components/createVote/CategoryPanel";
import { Voter, VoteType } from "../components/createVote/VoteTypePanel";
import { PrivacySetting } from "../components/listvotings/PrivacyButtons";
import { ManagerContract } from "../typed-contracts/ManagerContract";
import { VotingContract } from "../typed-contracts/VotingContract";

export type ContractAddress = string;

export type BlockchainData = {
    manager: ManagerContract;
    accounts: string[];
    web3: Web3;
};

export type Category = {
    address: ContractAddress;
    name: string;
};

export type Voting = {
    contract: VotingContract;
    info: VotingInfo;
};

// tslint:disable-next-line:interface-name
export interface VoteFormData {
    question: string;
    answers: string[];
    voteEndTime: number;
    resultsViewingEndTime: number;
    categoryPanel: CategoryPanelType;
    chosenCategory: string | ContractAddress;
    voteType: VoteType;
    privilegedVoters: Voter[];
}

export type VotingInfo = {
    question: string;
    categoryAddress: ContractAddress;
    answers: string[];
    votingEndTime: number;
    resultsEndTime: number;
    isPrivate: boolean;
    isPrivileged: boolean;
};
