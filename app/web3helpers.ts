import Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider);

export function createVotingOptions(options: string[]) {
    return options.map((opt) => web3.utils.fromAscii(opt));
}

export function createCategoryName(name: string) {
    return web3.utils.fromAscii(name);
}
