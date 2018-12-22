/* eslint-disable */
import Web3 from "web3";

/**
  @typedef BlockchainData
  @property {Contract} manager - manager contract instance
  @property {String[]} accounts - user accounts
  @property {Web3} web3 - web3 instance
 */
class BlockchainData {
  /**
   *
   * @param {any} manager
   * @param {String[]} accounts
   * @param {Web3} web3
   */
  constructor(manager, accounts, web3) {
    this.manager = manager;
    this.accounts = accounts;
    this.web3 = web3;
  }
}

export default BlockchainData;
