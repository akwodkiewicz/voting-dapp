import { CategoryPanelType, PrivacySetting, VoteType, VotingExpiryOption } from "./enums";
import moment, { Moment } from "moment";
import { ManagerContract } from "../typed-contracts/ManagerContract";
import { VotingContract } from "../typed-contracts/VotingContract";
import Web3 = require("web3");

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
    voteEndDateTime: moment.Moment;
    votingExpiryOption: VotingExpiryOption;
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
    hasUserVoted: boolean;
};

export type VotingCreatedEventData = {
    creator: ContractAddress;
    votingAddress: ContractAddress;
    question: string;
};

export type Voter = string;
