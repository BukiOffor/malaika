// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./Token.sol";
import "hardhat/console.sol";


error NotenoughAmount();
error AmountNeededNotRaised();
error NotOwner();
//error balanceLessThanMinAmount();
error DistributionFailed();
error TransactionFailed();
error SeedValueAlreadyWithdrawn();
error AmountDonatingGreaterThanRemainingAmountNeeded();
error CrowdFundingEnded();

/// @title CrowdSource
/// @author @BukiOffor
/// @notice To guard against the fluctuations of a crypto assest, this contract will work best with a stable coin
/// @notice This contract has not been audited 
/// @dev All function calls are currently implemented without side effects

contract CrowdSource{
    
    /// @dev do not change the order of the storage or it will break the code

    uint256 amountNeeded;
    uint256 minAmount; 
    address owner;
    uint256 shareAmount;  //amount of eth to be divided by share holders once amount is reached
    bool withdrawn; 
    AggregatorV3Interface internal priceFeed;
    Token liquidityProvider;

    mapping(address=>uint256) public donaters;
    address[] public shareholders;

    //EVENTS
    event Donated(address indexed donater, uint256 indexed amount);
    event SeedAmountWithdrawn(address indexed withdrawer, uint indexed amount, uint indexed time);
    event ExternalTransaction(address sender, uint amount);

    constructor(uint _amountNeeded, uint _minAmount, address _priceFeed,address _owner){
        owner = _owner;
        amountNeeded = _amountNeeded * 1e18;
        //multiply by 18 decimals to enable easy division since wei and pricefeed has been converted tp 18 decimals
        minAmount = (_minAmount * 1e18);
        priceFeed = AggregatorV3Interface(_priceFeed);
        liquidityProvider = new Token(_amountNeeded*1e18);
        shareAmount = 10e18;
    }

    modifier onlyOwner {
        if(msg.sender != owner){
            revert NotOwner();
        }
        _;
    }

    /** 
     * @dev this function can only be called once,
     * The contract balance must be greater than the amount needed for the call to be successful 
     * @notice This functions allows the amountNeeded a price difference of 5 dollars
     */
    function withdraw()external onlyOwner{
        if(withdrawn){revert SeedValueAlreadyWithdrawn();}
        uint amountDonatedInUsd = equatePrice(address(this).balance);
        //uint _amountNeeded = amountNeeded;
        if( amountDonatedInUsd/1e18 < (amountNeeded/1e18)-5 ){
            revert AmountNeededNotRaised();
            }
        (bool sent,) = owner.call{value:address(this).balance}("");
        if(!sent){
            revert TransactionFailed();
            }
        withdrawn = true;
        emit SeedAmountWithdrawn(msg.sender,address(this).balance,block.timestamp);

    }

    /// @notice This function gets the price of USD/ETH
    /// @return answer is the price of 1 eth in dollars
    /// @dev we are multiplying answer by 1e10 because answer returns in a 8 decimal format, so multiplying by 10 makes it 18
    function getLatestPrice() internal view returns (uint) {
        (,int answer, , ,) = priceFeed.latestRoundData();
        //console.log("latest eth price in 18 decimals == ", uint(answer*1e10));
        return uint(answer * 1e10);
    }

    /// @dev this function converts eth to its equivalent amount in dollars   
    /// @param ethAmount as the msg.value
    /// @return ethAmountInUsd : the equivalent amount of the msg.value in dollars with 18 decimals
    function equatePrice(uint ethAmount) internal view returns(uint256 ethAmountInUsd){
        uint usdEthPrice = getLatestPrice();
        ethAmountInUsd = (usdEthPrice * ethAmount) / 1e18;
        //console.log("USD amount of eth donated == ",ethAmountInUsd/1e18);
    }

    /// @notice requires that the remainder is not less than minimum account
    function donate()payable external {
        if(withdrawn){revert CrowdFundingEnded();}
        if(equatePrice(msg.value) < minAmount){
            revert NotenoughAmount();
        }
        if(_getRemainderBalance() < 0){
            revert AmountDonatingGreaterThanRemainingAmountNeeded();
        }
        donaters[msg.sender] = msg.value;
        shareholders.push(msg.sender);
        liquidityProvider.transfer(msg.sender,getPercentage(msg.value));
        emit Donated(msg.sender,msg.value);
    }

    /**
     * @dev this function simulates the transaction and makes sure that any amount donated,
     * does not make the contract balance to be greater than the needed amount 
     * @return remainder :balance needed for the funded amount to be complete, this
     * @notice amount is an int so we can check when its negative. the remainder being negative 
     * means that the amount donated is greater than the remaining balance.
     */
    function _getRemainderBalance() internal view returns(int remainder){
        int amount = int(equatePrice(address(this).balance));
        remainder = int(amountNeeded) - amount;
        //console.log('Simulated Amount donated in USD', uint(amount));
    }
    
    /// @return remainder :amount needed for the funded amount to be complete 
    /// @notice this function is for public use
    function getRemainderBalance() public view returns(uint remainder){
        uint amount = equatePrice(address(this).balance);
        remainder = amountNeeded - amount;
        console.log('Amount donated in USD', amount/1e18);
        console.log('Balance remaining in USD', remainder/1e18);
    }

    function getBalanceInEth()public view returns(uint balance){
        uint amount = getRemainderBalance();
        uint price = getLatestPrice();
        balance = (amount*1e18)/price;
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

    /** 
    * @dev This function returns the donations to there original wallets, if deadline elapses or funding fails
    * @notice we can subtract the gas fees from donater by doing amountDue - tx.gasprice
    * @notice functions destroys the contract after 
    * */
    function revertDonations()public onlyOwner {
       address[] memory holders = shareholders;
        for(uint i =0; i < holders.length; i++){
            uint amountDue = donaters[holders[i]] - tx.gasprice;
            (bool sent, ) = holders[i].call{value:amountDue}("");
            if(!sent){
                revert DistributionFailed();
            }
        }
        selfdestruct(payable(address(this)));
    }

    /// @dev this is a test function, will be removed during production
    // function redeemShares()public onlyOwner {
    //     uint balance = address(this).balance;
    //     uint shareInTokens = returnShare(msg.sender);
    //     uint shareInEth = (shareInTokens * balance)/100e18;
    //     (bool success,) = msg.sender.call{value:shareInEth}("");
    //     require(success,"Impossible Transfer");
    //     console.log(shareInEth);
    // }

    /// @dev this function redeems the amount each share holder is due, once the balance > shareAmount
    /// @notice The shareInEth is divided by 100e18 because the other variables are in 18 decimals  
    function _redeemReturns(address _shareholder)internal view returns(uint shareInEth){
        uint balance = address(this).balance;
        if(balance < shareAmount){
            revert NotenoughAmount();
        }
        uint shareInTokens = returnShare(_shareholder);
        shareInEth = (shareInTokens * shareAmount)/100e18;
    }

    /// @dev this function distributes the equivalent Share amount in eth to all the shareHolders
    function distributeReturns()public{
        if(!withdrawn){revert AmountNeededNotRaised();}
        address[] memory holders = shareholders;
        for(uint i =0; i < holders.length; i++){
            uint amountDue = _redeemReturns(holders[i]);
            (bool sent, ) = holders[i].call{value:amountDue}("");
            if(!sent){revert DistributionFailed();}
            console.log("sending ",amountDue," to",holders[i]);
        }
    }

    /**
     * @notice This function transfers ones shares(tokens) to another person
     * @param receipient address of the share receipient
     * @param amount of share to transer 
     */

    function transferShare(address receipient, uint amount)external returns(bool) {
        bool success = liquidityProvider.transfer(receipient,amount);
        return success;
    }

     /// @notice adjusts the minimum amount incase the remainder balance is less than minAmount
    function adjustMinAmount(uint newMinAmount)public onlyOwner {
        minAmount = newMinAmount;  
    }
    /// @notice receives ether and distributes ROI to the stake holders
    receive()external payable{
        distributeReturns();
        emit ExternalTransaction(msg.sender,msg.value);
    }

    /// @param _newOwner address of the new owner of the contract
    /// ideally, this should be the address with the highest number of tokens
    function changeOwner(address _newOwner)external onlyOwner {
        assembly{
            sstore(0x02,_newOwner)
        }
    }

    /// @return tokenAddress : the address of the liquidity provider Tokens
    function getTokenAddress()external view returns (address tokenAddress){
        tokenAddress = address(liquidityProvider);
    }

}

