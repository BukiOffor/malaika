// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.12;

import "./CrowdSource.sol";
//import "@openzeppelin/contracts/utils/Create2.sol";
import "hardhat/console.sol";


// staking 
// multisig wallet escrow to approval transactions 


contract Factory {
    error OwnerMustEqualSender();

    address[] MarketPlace;
    mapping(uint => address) indexToContract;
    mapping(address=>address) ownerToContract;
    mapping(uint256 => uint8) approveWithdrawal;

    event CrowdSourceCreated(
        address indexed contractAddress,
        address indexed creator,
        uint indexed amount
    );

    function CreateCrowdSource(
        uint _amountNeeded,
        uint _minAmount,
        address _priceFeed,
        address _owner,
        uint8 _percentage
    ) public {
        if (msg.sender != _owner) {
            revert OwnerMustEqualSender();
        }
        CrowdSource _crowdsource = new CrowdSource(
            _amountNeeded,
            _minAmount,
            _priceFeed,
            _owner,
            _percentage,
            MarketPlace.length
        );
        MarketPlace.push(address(_crowdsource));
        indexToContract[MarketPlace.length] = address(_crowdsource);
        approveWithdrawal[MarketPlace.length] = 0;
        emit CrowdSourceCreated(
            address(_crowdsource),
            msg.sender,
            _amountNeeded
        );
    }

    //create a create2 address

    function getMarketPlace()
        external
        view
        returns (address[] memory marketplace)
    {
        marketplace = MarketPlace;
    }

    function allowUnstake(uint256 _contractNumber)external{
        if(indexToContract[_contractNumber] != msg.sender){revert OwnerMustEqualSender();}
        //allow creator to withdraw
        approveWithdrawal[MarketPlace.length] = 1;


    }
}
