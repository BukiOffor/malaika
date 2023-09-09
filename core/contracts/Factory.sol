// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.12;

import "./CrowdSource.sol";
import "hardhat/console.sol";
import "./PriceConverter.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";



// staking 
// multisig wallet escrow to approval transactions 
// change creators address in contract mapping to address(0) once a creator has unstaked, this will enable a user to create a new project


contract Factory {
    error OwnerMustEqualSender();
    error UnstakeNotApproved();
    error OwnerAlreadyExsists();
    error OwnerShipWasTransfered();
    error ReversedTransaction();
    error CreatorExists();
    error InsufficientStakeDeposit();

    using PriceConverter for uint256;

    // make sure an owner can only have 1 running project
    address[] MarketPlace;
    mapping(uint => address) indexToContract; 
    mapping(address => address) contractToOwner; 
    mapping(uint256 => uint8) approveWithdrawal;
    mapping(address => uint256) addressToStake;

    event CrowdSourceCreated(
        address indexed contractAddress,
        address indexed creator,
        uint indexed amount
    );
    event Unstaked(address contractAddress, address owner, uint256 amount);
    event ReversedInternalTransaction(address from, uint amount);

    function CreateCrowdSource(
        uint _amountNeeded,
        uint _minAmount,
        address _priceFeed,
        address _owner,
        uint8 _percentage
    ) public payable {
        if (msg.sender != _owner) {
            revert OwnerMustEqualSender();
        }
        if (_isCreator(msg.sender)){
            revert CreatorExists();
        }
        uint stake = (_amountNeeded*1e18) /4e18;
        if(PriceConverter.getConversionRate(msg.value,AggregatorV3Interface(_priceFeed)) < stake*1e18){
            revert InsufficientStakeDeposit();
        }
        console.log(PriceConverter.getConversionRate(msg.value,AggregatorV3Interface(_priceFeed)));
        CrowdSource _crowdsource = new CrowdSource(
            _amountNeeded,
            _minAmount,
            _priceFeed,
            _owner,
            _percentage,
            MarketPlace.length + 1,
            address(this)
        );
        MarketPlace.push(address(_crowdsource));
        indexToContract[MarketPlace.length ] = address(_crowdsource);
        addressToStake[msg.sender]= msg.value;
        approveWithdrawal[MarketPlace.length ] = 0;
        contractToOwner[address(_crowdsource)] = msg.sender;
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
        //bytes4 selector = this.getMarketPlace.selector;
    }
/**
 * This function call only be called by the child contract,
 * when called the function checks if the stake amount has been withdrawn before,
 * if not, it sets the value to 1 
 * @param _contractNumber the index number of the contract, this value is used to track each contract
 * @dev msg.sender here must equal the deployed CrowdSource contract instance
 */
    function allowUnstake(uint256 _contractNumber)external returns(bool){
        console.log("sender is ", msg.sender);
        console.log("contract number is", _contractNumber);
        console.log("indexToContract Address is", indexToContract[_contractNumber]);
        if(indexToContract[_contractNumber] != msg.sender){
            revert OwnerMustEqualSender();
            }
        if(approveWithdrawal[_contractNumber] == 99){
            revert SeedValueAlreadyWithdrawn();
        }
        //allow creator to withdraw
        approveWithdrawal[_contractNumber] = 1;
        return true;
    }


/**
 * checks that the msg.sender
 * @param _contractIndex the index number of the contract, this value is used to track each contract
 */
    function unStake( uint256 _contractIndex)external{
        address contractAddress = indexToContract[_contractIndex];
        uint amount = addressToStake[msg.sender];
        if(addressToStake[msg.sender]==1){revert OwnerShipWasTransfered();}
        if(!_isCreator(msg.sender)){revert OwnerMustEqualSender();}
        if(approveWithdrawal[_contractIndex] == 1 && contractToOwner[contractAddress] == msg.sender){
            approveWithdrawal[_contractIndex] = 99;
            uint amountToSend = addressToStake[msg.sender] - tx.gasprice;
            addressToStake[msg.sender] = 0;
            (bool success, ) = msg.sender.call{value:amountToSend}("");
            if(!success){
                revert TransactionFailed();
                }else{
                    emit Unstaked(contractAddress,msg.sender,amount);
                }
        
         }else{
            revert UnstakeNotApproved();
         }
          
       
    }
    /**
     * return the contracts created by an address
     * @param _contract the address of the contract
     * @param _creator the creator of a contract to be checked
     */
    function isOwner(address _contract, address _creator)external view returns(bool success){
        if(contractToOwner[_contract] == _creator){
            return true;
        }
    }
    

    function changeOwner(uint256 _contractNumber, address newOwner)external returns(bool){
        if(_isCreator(newOwner)){revert OwnerAlreadyExsists();}
        if(indexToContract[_contractNumber] != msg.sender){
            revert OwnerMustEqualSender();
            }       
            contractToOwner[msg.sender] = newOwner;
            addressToStake[newOwner] = 1;
            return true;
    }

    function isCreator(address _creator)external view returns(bool success){
        if(addressToStake[_creator] > 0){
            return true;
        }
    }
    function _isCreator(address _creator)internal view returns(bool success){
        if(addressToStake[_creator] > 0){
            return true;
        }
    }
    
    receive() external payable {    
        (bool success, ) = msg.sender.call{value: (msg.value - tx.gasprice)}("");
        if (!success) {
            revert TransactionFailed();           
        }else{
            emit ReversedInternalTransaction(msg.sender, msg.value);
        }
    }

    function getContract(uint256 index)external view returns(address contractAddr){
        contractAddr = indexToContract[index];
    } 

    function getUnstaked(uint256 index)external view returns(bool success){
        if(approveWithdrawal[index] == 1){
            return true;
        } else {
            return false;
        }
    }
    function getStakeAmount(address creator) external view returns(uint256 stake){
        stake = addressToStake[creator];
    }
        
}
