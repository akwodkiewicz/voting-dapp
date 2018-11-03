pragma solidity 0.4.24;
pragma experimental ABIEncoderV2;

import "./VotingContract.sol";
import "./CategoryContract.sol";


contract ManagerContract {
   
    address[] public categoryContractsList;
    mapping(address => bool) public doesCategoryExist;
    mapping(bytes32 => bool) public isCategoryNameUsed;

    function createVotingWithExistingCategory(address _category,
        string _question,
        string[] _options,
        uint256 _votingEndTime,
        uint256 _resultsEndTime,
        bool _isPrivate,
        address[] _permissions) public returns(address) {

        require(doesCategoryExist[_category], "Provided addresss does not point to an existing category!");
        CategoryContract cc = CategoryContract(_category);
        address vcAddress = cc.createVotingContract(_question, _options, _votingEndTime, _resultsEndTime, _isPrivate, _permissions);
        return vcAddress;
    }

    function createVotingWithNewCategory(bytes32 _categoryName,
        string _question,
        string[] _options,
        uint256 _votingEndTime,
        uint256 _resultsEndTime,
        bool _isPrivate,
        address[] _permissions) public returns(address) {
        
        require(!isCategoryNameUsed[_categoryName], "This category name is already used");

        bytes memory categoryNameArray = new bytes(32);
        for (uint256 i; i < 32; i++) {
            categoryNameArray[i] = _categoryName[i];
        }
        string memory categoryName = string(categoryNameArray);

        CategoryContract cc = new CategoryContract(categoryName);
        isCategoryNameUsed[_categoryName] = true;
        doesCategoryExist[address(cc)] = true;
        categoryContractsList.push(address(cc));

        address vcAddress = cc.createVotingContract(_question, _options, _votingEndTime, _resultsEndTime, _isPrivate, _permissions);
        return vcAddress;
    }
}