// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;


interface Ifactory {
    
    event CrowdSourceCreated(address indexed contractAddress,address indexed creator,uint indexed amount);
    event Unstaked(address contractAddress, address owner, uint256 amount);
    event ReversedInternalTransaction(address from, uint amount);


    function CreateCrowdSource(uint _amountNeeded, uint _minAmount,address _priceFeed,address _owner,uint8 _percentage ) external payable ;
    
    function getMarketPlace() external view returns (address[] memory marketplace);

    function allowUnstake(uint256 _contractNumber) external returns(bool);

    function unStake( uint256 _contractIndex)external ;

    function isOwner(address _contract, address _creator)external view returns(bool success);

    function changeOwner(uint256 _contractNumber, address newOwner)external returns(bool);

    function isCreator(address _creator)external view returns(bool success);

    function getContract(uint256 index)external view returns(address contractAddr);

    function getUnstaked(uint256 index)external view returns(bool success);

    function getStakeAmount(address creator) external view returns(uint256 stake);

}