import { CategoryContractContract, ManagerContractContract, VotingContractContract } from "../types/truffle-contracts";

export const ManagerContract = artifacts.require("ManagerContract") as ManagerContractContract;
export const CategoryContract = artifacts.require("CategoryContract") as CategoryContractContract;
export const VotingContract = artifacts.require("VotingContract") as VotingContractContract;
