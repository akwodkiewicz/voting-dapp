pragma solidity ^0.4.23;
pragma experimental ABIEncoderV2;

import "./VotingContract.sol";

contract CategoryContract {
    
    address[] votingContracts;
    string categoryName;
    uint8 numberOfContractsToDelete = 1;
    uint8 votingContractsLimit = 2;
    
    constructor(string _categoryName, 
        string _question,
        string[] _options,
        uint256 _votingEndTime,
        uint256 _resultsEndTime,
        bool _isPrivate,
        address[] _permissions) {
                    
        categoryName = _categoryName;
        
        // Scenario: user creates new VC with a new category: a new CC should be created along with the VC
        // It is better to make it in one transaction instead of creating CC and then creating VC in seperate
        // To create just a CC use as arguments: "CategoryName", "", [], "", "", false, []
        
        // TODO: require MC address

        if(bytes(_question).length > 0) {
            VotingContract vc = new VotingContract(
            _question, address(this), _options, _votingEndTime, _resultsEndTime, _isPrivate, _permissions);
        
            votingContracts.push(address(vc));
        }
        
    }
    
    // Scenario: user creates new VC within existing category.
    // TODO: require MC address

    function createVotingContract (
        string _question, 
        address _category, 
        string[] _options, 
        uint256 _votingEndTime, 
        uint256 _resultsEndTime, 
        bool _isPrivate, address[] _permissions) public returns(address) {
        
        VotingContract vc = new VotingContract(
            _question, address(this), _options, _votingEndTime, _resultsEndTime, _isPrivate, _permissions);
        
        
        uint8 i = 0;
        // iterating to remove the contract which is expired
        if(votingContracts.length > votingContractsLimit) {
            for(i = 0; i < votingContracts.length; i++) {
                VotingContract v = VotingContract(votingContracts[i]);
                if(now > v.resultsEndTime()) {
                    votingContracts[i] = address(vc);
                    break;
                }
            }
        }
        
        if(i == votingContracts.length) {
            votingContracts.push(address(vc));
        }

        return address(vc);
    }
    
    function viewVotingContracts() view public returns(address[]) {
        return votingContracts;
    }

}