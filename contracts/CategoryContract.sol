pragma solidity 0.4.24;

import "./VotingContract.sol";


contract CategoryContract {
    
    address[] public votingContracts;
    bytes32 public categoryName;


    // TODO: require MC address
    constructor(bytes32 _categoryName) public {
        categoryName = _categoryName;
    }
    
    // TODO: require MC address
    function createVotingContract (
        string _question,
        bytes32[] _options,
        uint256 _votingEndTime,
        uint256 _resultsEndTime,
        bool _isPrivate,
        address[] _permissions) public returns(address) {
        
        VotingContract vc = new VotingContract(
            _question, address(this), _options, _votingEndTime, _resultsEndTime, _isPrivate, _permissions);
        
        uint8 i = 0;
        // iterating to remove the contract which is expired
        for (i = 0; i < votingContracts.length; i++) {
            VotingContract v = VotingContract(votingContracts[i]);
            if (now > v.resultsEndTime()) {
                votingContracts[i] = address(vc);
                break;
            }
        }
        
        if (i == votingContracts.length) {
            votingContracts.push(address(vc));
        }

        return address(vc);
    }

    function numberOfContracts() public view returns (uint) {
        return votingContracts.length;
    }
}