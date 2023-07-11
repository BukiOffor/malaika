// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.12;

import "./CrowdSource.sol";
//import "@openzeppelin/contracts/utils/Create2.sol";
import "hardhat/console.sol";

contract Factory{
    
    error OwnerMustEqualSender();

    address[] MarketPlace;
    mapping(uint=>address) indexToContract;

    event CrowdSourceCreated(address indexed contractAddress, address indexed creator, uint indexed amount);

    function CreateCrowdSource(uint _amountNeeded, uint _minAmount, address _priceFeed, address _owner) public
    {
        if(msg.sender != _owner){
            revert OwnerMustEqualSender();
        }
        CrowdSource _crowdsource = new CrowdSource(_amountNeeded,_minAmount,_priceFeed, _owner);
        MarketPlace.push(address(_crowdsource));
        indexToContract[MarketPlace.length] = address(_crowdsource);
        emit CrowdSourceCreated(address(_crowdsource), msg.sender,_amountNeeded);
        console.log("address", address(_crowdsource));
    }

    function getMarketPlace()external view returns(address[] memory marketplace){
        marketplace = MarketPlace;
    }
}
