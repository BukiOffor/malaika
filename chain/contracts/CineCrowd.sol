// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./Token.sol";
import "hardhat/console.sol";

/// @title cineCrowd
/// @author Buki
/// @notice To guard against the fluctuations of a crypto assest, this contract will work best with a stable coin
/// @notice This contract has not been audited 
/// @dev All function calls are currently implemented without side effects

contract CineCrowd{
    
    error notenoughAmount();
    error notOwner();
    error balanceLessThanMinAmount();
    error distributionFailed();
    error transactionFailed();
    error SeedValueAlreadyWithdrawn();
    /// @dev do not change the order of the storage or it will break the code
    
    uint256 amountNeeded;
    uint256 minAmount; 
    address owner;
    uint256 shareAmount;
    bool withdrawn; //amount of eth to be divided by share holders once amount is reached
    AggregatorV3Interface internal priceFeed;
    Token liquidityProvider;


    event Donated(address indexed donater, uint256 indexed amount);
    event SeedAmountWithdrawn(address indexed withdrawer, uint indexed amount, uint indexed time);

    mapping(address=>uint256) donaters;
    address[] shareholders;

    constructor(uint _amountNeeded, uint _minAmount, address _priceFeed,address _owner){
        owner = _owner;
        amountNeeded = _amountNeeded * 1e18;
        //multiply by 18 decimals to enable easy division since wei and pricefeed has been converted tp 18 decimals
        minAmount = _minAmount * 1e18;
        priceFeed = AggregatorV3Interface(_priceFeed);
        liquidityProvider = new Token(_amountNeeded*1e18);
        shareAmount = 10e18;
    }

    modifier onlyOwner {
        if(msg.sender != owner){
            revert notOwner();
        }
        _;
    }

    /** 
     * @dev this function can only be called once,
     * The contract balance must be greater than the amount needed for the call to be successful 
     */
    function withdraw()external onlyOwner{
        if(withdrawn){revert SeedValueAlreadyWithdrawn();}
        uint amountDonatedInUsd = equatePrice(address(this).balance);
        if( amountDonatedInUsd < amountNeeded ){
            revert notenoughAmount();
            }
        (bool sent,) = owner.call{value:address(this).balance}("");
        if(!sent){
            revert transactionFailed();
            }
        withdrawn = true;
        emit SeedAmountWithdrawn(msg.sender,address(this).balance,block.timestamp);

    }

    /// @notice This function gets the price of USD/ETH
    /// @return return the price of 1 eth in dollars
    /// @dev we are multiplying answer by 1e10 because answer returns in a 8 decimal format, so multiplying by 10 makes it 18
    function getLatestPrice() internal view returns (uint) {
        (,int answer, , ,) = priceFeed.latestRoundData();
        return uint(answer * 1e10);
    }

    /// @dev this function converts eth to its equivalent amount in dollars   
    /// @param ethAmount as the msg.value
    /// @return ethAmountInUsd : the equivalent amount of the msg.value in dollars with 18 decimals
    function equatePrice(uint ethAmount) internal view returns(uint256 ethAmountInUsd){
        uint usdEthPrice = getLatestPrice();
        ethAmountInUsd = (usdEthPrice * ethAmount) / 1e18;
        console.log(ethAmountInUsd/1e18);
    }

    /// @notice requires that the remainder is not less than minimum account
    function donate()payable external {
        if(equatePrice(msg.value) < minAmount){
            revert notenoughAmount();
        }
        if(getRemainderBalance() < minAmount){
            revert balanceLessThanMinAmount();
        }
        donaters[msg.sender] = msg.value;
        shareholders.push(msg.sender);
        liquidityProvider.transfer(msg.sender,getPercentage(msg.value));
        emit Donated(msg.sender,msg.value);
    }

    /// @return remainder :amount needed for the funded amount to be complete 
    function getRemainderBalance() public view returns(uint remainder){
        uint amount = equatePrice(address(this).balance);
        remainder = amountNeeded - amount;
    }

     /**
     * @notice To get the figures in its original numbers,
     *  we have to further divide percentageShare it by 1e18 to get the floating equivalent of what we need.
     * @return percentageShare the percentage of amountNeeded donated by the donater
     * @dev this function calculates the percentage donated by the donated 
     * */ 
    function getPercentage(uint _amount)public view returns(uint percentageShare) {
        uint amountDonated = equatePrice(_amount);
        percentageShare = (amountDonated*100e18)/amountNeeded;
    }

    /// @dev this function returns the amount of share a shareholder owns in LP token
    function returnShare(address _account)public view returns(uint share) {
        share = liquidityProvider.balanceOf(_account);
    }

/// @dev This function returns the donations to there original wallets, if deadline elapses
    function revertDonations()public onlyOwner {
        uint balance = address(this).balance;
        uint shareInTokens = returnShare(msg.sender);
        uint shareInEth = (shareInTokens * balance)/100e18;
        (bool success,) = msg.sender.call{value:shareInEth}("");
        require(success,"Impossible Transfer");
        console.log(shareInEth);

    }

    /// @dev this function redeems the amount each share holder is due, once the balance > shareAmount
    /// @notice The shareInEth is divided by 100e18 because the other variables are in 18 decimals  
    function redeemReturns(address _shareholder)internal view returns(uint shareInEth){
        uint balance = address(this).balance;
        if(balance < shareAmount){
            revert notenoughAmount();
        }
        uint shareInTokens = returnShare(_shareholder);
        shareInEth = (shareInTokens * shareAmount)/100e18;
    }

    /// @dev this function distributes the equivalent Share amount in eth to all the shareHolders
    function distributeReturns()external{
        address[] memory holders = shareholders;
        for(uint i =0; i < holders.length; i++){
            uint amountDue = redeemReturns(holders[i]);
            (bool sent, ) = holders[i].call{value:amountDue}("");
            if(!sent){revert distributionFailed();}
        }
    }

     /// @notice adjusts the minimum amount incase the remainder balance is less than minAmount
    function adjustMinAmount(uint newMinAmount)public onlyOwner {
        minAmount = newMinAmount;  
    }

}

