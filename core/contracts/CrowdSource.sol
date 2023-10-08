// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./Token.sol";
import "hardhat/console.sol";
import {Ifactory} from "./Interface/Ifactory.sol";

error NotenoughAmount();
error AmountNeededNotRaised();
error NotOwner();
error NotShareHolder();
error DistributionFailed();
error TransactionFailed();
error SeedValueAlreadyWithdrawn();
error AmountDonatingGreaterThanRemainingAmountNeeded();
error CrowdFundingEnded();
error NotApproved();
error YouHaveBeenUnstaked();
error UnableToUnstake();
error OwnerCouldNotBeChanged();
error FactoryCouldNotBeUnstaked();

/// @title CrowdSource
/// @author @BukiOffor
/// @notice To guard against the fluctuations of a crypto assest, this contract will work best with a stable coin
/// @notice This contract has not been audited
/// @dev All function calls are currently implemented without side effects

contract CrowdSource {
    /// @dev do not change the order of the storage or it will break the code, but you can add to it

    uint256 public immutable  amountNeeded;
    uint256 immutable public contractNumber;
    uint8 immutable public percentage;

    uint256 public minAmount;
    address public owner;
    uint256 public shareAmount; //minimum amount of eth required to be in the contract before ROI is shared
    uint64 public approveUnstake;
    uint8 public withdrawn;
    uint8 public unstaked;
    AggregatorV3Interface internal priceFeed;
    Ifactory internal factory;
    Token liquidityProvider;

    mapping(address => uint256) public donaters;
    address[] public shareholders;
    address[]public approvals;

    //EVENTS
    event Donated(address indexed donater, uint256 indexed amount);
    event SeedAmountWithdrawn(
        address indexed withdrawer,
        uint indexed amount,
        uint indexed time
    );
    event ExternalTransaction(address sender, uint amount);
    event ReversedTransaction(address indexed sender, uint indexed amount);
    event OwnerChanged(address indexed oldOwner, address indexed newOwner);

    constructor(
        uint _amountNeeded,
        uint _minAmount,
        address _priceFeed,
        address _owner,
        uint8 _percentage,
        uint256 _contractNumber,
        address _factory
    /** uint8 _time */ // how long will the contract be valid after the project is life
    ) {
        owner = _owner;
        amountNeeded = _amountNeeded * 1e18;
        //multiply by 18 decimals to enable easy division since wei and pricefeed has been converted tp 18 decimals
        minAmount = (_minAmount * 1e18);
        priceFeed = AggregatorV3Interface(_priceFeed);
        //?? should i set token amount to 100 since only 100 token signifying the % of shares will be sent to shareholders
        liquidityProvider = new Token(_amountNeeded * 1e18);
        // allow liquidity providers to set share amount and percentage
        shareAmount = 10e18;
        percentage = _percentage;
        //contract indexer
        contractNumber = _contractNumber;
        withdrawn = 0;
        unstaked = 0;
        shareholders.push(_owner);
        factory = Ifactory(_factory);
    }

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert NotOwner();
        }
        _;
    }

    /**
     * @dev this function can only be called once,
     * The contract balance must be greater than the amount needed for the call to be successful
     * @notice This functions allows the amountNeeded a price difference of 5 dollars
     */
    function withdraw() external onlyOwner {
        if (withdrawn == 1) {
            revert SeedValueAlreadyWithdrawn();
        }
        uint amountDonatedInUsd = equatePrice(address(this).balance);
        //uint _amountNeeded = amountNeeded;
        if (amountDonatedInUsd / 1e18 < (amountNeeded / 1e18) - 5) {
            revert AmountNeededNotRaised();
        }
        (bool sent, ) = owner.call{value: address(this).balance}("");
        if (!sent) {
            revert TransactionFailed();
        }
        withdrawn = 1;
        emit SeedAmountWithdrawn(
            msg.sender,
            address(this).balance,
            block.timestamp
        );
    }

    /// @notice This function gets the price of USD/ETH
    /// @return answer is the price of 1 eth in dollars
    /// @dev we are multiplying answer by 1e10 because answer returns in a 8 decimal format, so multiplying by 10 makes it 18
    function getLatestPrice() external view returns (uint) {
        (, int answer, , , ) = priceFeed.latestRoundData();
        //console.log("latest eth price in 18 decimals == ", uint(answer*1e10));
        return uint(answer * 1e10);
    }

    function _getLatestPrice() internal view returns (uint) {
        (, int answer, , , ) = priceFeed.latestRoundData();
        //console.log("latest eth price in 18 decimals == ", uint(answer*1e10));
        return uint(answer * 1e10);
    }

    /// @dev this function converts eth to its equivalent amount in dollars
    /// @param ethAmount as the msg.value
    /// @return ethAmountInUsd : the equivalent amount of the msg.value(ETH) in dollars with 18 decimals
    function equatePrice(
        uint ethAmount
    ) internal view returns (uint256 ethAmountInUsd) {
        uint usdEthPrice = _getLatestPrice();
        ethAmountInUsd = (usdEthPrice * ethAmount) / 1e18;
        //console.log("USD amount of eth donated == ",ethAmountInUsd/1e18);
    }

    /// @notice requires that the remainder is not less than minimum account
    function donate() external payable {
        if (withdrawn == 1) {
            revert CrowdFundingEnded();
        }
        if (equatePrice(msg.value) < minAmount) {
            revert NotenoughAmount();
        }
        if (_getRemainderBalance() < 0) {
            revert AmountDonatingGreaterThanRemainingAmountNeeded();
        }
        donaters[msg.sender] = msg.value;
        (bool donated,)= _isHolder(msg.sender);
        if(!donated){
            shareholders.push(msg.sender);
        }
        liquidityProvider.transfer(msg.sender, getPercentage(msg.value));
        emit Donated(msg.sender, msg.value);
    }

    /**
     * @dev this function simulates the transaction and makes sure that any amount donated,
     * does not make the contract balance to be greater than the needed amount
     * @return remainder :balance needed for the funded amount to be complete, this
     * @notice amount is an int so we can check when its negative. the remainder being negative
     * means that the amount donated is greater than the remaining balance.
     */
    function _getRemainderBalance() internal view returns (int remainder) {
        int amount = int(equatePrice(address(this).balance));
        remainder = int(amountNeeded) - amount;
        //console.log('Simulated Amount donated in USD', uint(amount));
    }

    /// @return remainder :amount needed for the funded amount to be complete
    /// @notice this function is for public use
    function getRemainderBalance() public view returns (uint remainder) {
        uint amount = equatePrice(address(this).balance);
        uint response = amountNeeded - amount;
        remainder = response/1e18;
        //console.log('Amount donated in USD', amount/1e18);
        //console.log('Balance remaining in USD', remainder/1e18);
    }

    function getBalanceInEth() public view returns (uint balance) {
        uint amount = getRemainderBalance();
        uint price = _getLatestPrice();
        balance = (amount * 1e18) / price;
    }

    /**
     * @notice To get the figures in its original numbers,
     *  we have to further divide percentageShare it by 1e18 to get the floating equivalent of what we need.
     * @return percentageShare the percentage of amountNeeded donated by the donater
     * @dev this function calculates the percentage donated by the donated
     * */
    function getPercentage(
        uint _amount
    ) public view returns (uint percentageShare) {
        uint amountDonated = equatePrice(_amount);
        percentageShare = (amountDonated * 100e18) / amountNeeded;
    }

    /// @dev this function returns the amount of share a shareholder owns in LP token
    function returnShare(address _account) public view returns (uint share) {
        share = liquidityProvider.balanceOf(_account);
    }

    /**
     * @dev This function returns the donations to there original wallets, if deadline elapses or funding fails
     * @notice we can subtract the gas fees from donater by doing amountDue - tx.gasprice
     * @notice functions destroys the contract after
     * */
    function revertDonations() public onlyOwner {
        if(withdrawn == 1){revert CrowdFundingEnded();}
        address[] memory holders = shareholders;
        for (uint i = 1; i < holders.length; i++) {
            uint amountDue = donaters[holders[i]] - tx.gasprice;
            (bool sent, ) = holders[i].call{value: amountDue}("");
            if (!sent) {
                revert DistributionFailed();
            }
        }
       bool success = _unstake(contractNumber);
       if(success){
        selfdestruct(payable(address(this)));
       }else{
        revert UnableToUnstake();
       }
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
    /// @param _shareholder this is the address of every shareholder in the contract
    /// @param balance this is the balance of the contract at the time of share
    /// @notice The shareInEth is divided by 100e18 because the other variables are in 18 decimals
    function _redeemReturns(
        address _shareholder,
        uint256 balance
    ) internal view returns (uint shareInEth) {
        //uint balance = address(this).balance;
        if (balance < shareAmount) {
            revert NotenoughAmount();
        }
        uint shareInTokens = returnShare(_shareholder);
        shareInEth = (shareInTokens * balance) / 100e18;
    }

    /** @dev this function distributes to the owner the owners percentage of the profit,
     * for this to work the initial owner, will persist on the contract as the first address
     * in the shareholder array.
     */
    function ownerRedeem()internal view returns(uint256 amountDue, address _owner){
        uint sharePercent = percentage * 1e18;
        uint256 balance = address(this).balance;
        amountDue = (sharePercent * balance)/100e18;
        _owner = shareholders[0];
    }
 
   /// @param _address the address to be checked if its a shareholder in the contract
    /// @return success true or false statement if address is holder or not
    /// @return index index of the holder on the contract shareholder array
    /** @notice we start from 1 to loop because 0 is a constant, we already know that the 
    * number 0 index in our smart contract belongs to the address of the initial owner of the contract
    * if we start our loop from zero, it messes up the algorithim should the owner donate to its contract 
    */
    function _isHolder(address _address)internal view returns(bool success, uint index){
        address[] memory holders = shareholders;
        uint256 checker = 1;
        for(uint i = 1; i < holders.length; i++){
            if(_address == holders[i]){
                return(true, checker);
            }
            checker++;
        }return(false,checker);

    }
    /// FOR TEST PURPOSES WILL BE REMOVED DURING PRODUCTION
    /// @param _address the address to be checked if its a shareholder in the contract
    /// @return success true or false statement if address is holder or not
    /// @return index index of the holder on the contract shareholder array
    /** @notice we start from 1 to loop because 0 is a constant, we already know that the 
    * number 0 index in our smart contract belongs to the address of the initial owner of the contract
    * if we start our loop from zero, it messes up the algorithim should the owner donate to its contract 
    */
    function isHolder(address _address)external view returns(bool success, uint index){
        address[] memory holders = shareholders;
        uint256 checker = 1;
        for(uint i = 1; i < holders.length; i++){
            if(_address == holders[i]){
                return(true, checker);
            }
            checker++;
        }return(false,0);

    }
    
    /// @dev changes the address of a shareholder
    function changeHolderAddress(address newOwner)external{
        (bool success, uint index) = _isHolder(msg.sender);
        if(!success){revert NotShareHolder();}
        shareholders[index] = newOwner;
    }

    /// this function is only used when a full Share Ownership is transfered
    /// @param _owner msg.sender of the call
    /// @param newOwner the new owner
    /// @dev check if receiver exists in the shareholder array if it does do not add, 
    //  delete old owner or change address to 0, if you change address to zero, check for zero addresses
    //  in the distribution function as not to cause a panic error and break the code
    function _changeHolderAddress(address _owner,address newOwner)private{
        (bool success, uint index) = _isHolder(_owner);
        if(!success){revert NotShareHolder();}
        (bool holder,) = _isHolder(newOwner);
        if(!holder){
            shareholders[index] = newOwner;
        }else{
            shareholders[index] = address(0); 
        }
    }

    /// @dev this function distributes the equivalent Share amount in eth to all the shareHolders
    function _distributeReturns() private {
        if (withdrawn == 0) {
            revert AmountNeededNotRaised();
        }
        (uint256 Owneramountdue, address _owner) = ownerRedeem();
        (bool success,) = _owner.call{value:Owneramountdue-tx.gasprice}("");
        if (!success) { revert DistributionFailed();}
        //console.log("sending ", Owneramountdue-tx.gasprice, " to", _owner);
        uint balance = address(this).balance;
        address[] memory holders = shareholders;
        for (uint i = 1; i < holders.length; i++) {
            //check if the holder has sold its share
            if(holders[i]!= address(0)){
                uint amountDue = _redeemReturns(holders[i], balance);
                //console.log("sending ", amountDue, " to", holders[i]); //remember to remove
                (bool sent, ) = holders[i].call{value: amountDue-tx.gasprice}("");
                if (!sent) {
                    revert DistributionFailed();
                }
            }
            
        }
    }

    /**
     * @notice This function transfers full shares(tokens) to another person
     * @param receipient address of the share receipient
     */

    function transferFullShare(
        address receipient
    ) external returns (bool) {
        uint amount = getLiquidityToken(msg.sender);
        liquidityProvider.approve(msg.sender,address(this),amount);
        bool success = liquidityProvider.transferFrom(msg.sender,receipient,amount);
        if(!success){revert TransactionFailed();}
        _changeHolderAddress(msg.sender,receipient);
        return success;    
    }

    /**
     * @notice This function transfers some shares(tokens) to another person
     * @param receipient address of the share receipient
     * @param amount of share to transer
     */
    function transferShare(
        address receipient,
        uint amount
    ) external returns (bool) {
        liquidityProvider.approve(msg.sender,address(this),amount);
        bool success = liquidityProvider.transferFrom(msg.sender,receipient,amount);
        if(!success){revert TransactionFailed();}
        (bool holder, ) = _isHolder(receipient);
        if(!holder){shareholders.push(receipient);}
        return success;       
    }

    function getLiquidityToken(
        address shareholder
    ) public view returns (uint256 liquidityShare) {
        liquidityShare = liquidityProvider.balanceOf(shareholder);
    }

    /// @notice adjusts the minimum amount incase the remainder balance is less than minAmount
    function adjustMinAmount(uint newMinAmount) public onlyOwner {
        minAmount = newMinAmount;
    }

    /**
     * @notice receives ether and distributes ROI to the stake holders
     * @dev insists on rejecting transactions that does not come through the donate function prior to withdrawal
     * because, if we receive transactions before amount needed is withdrawn. The percentage of
     * the amount received will not be issued out in tokens, therefore causing the contract to always
     * hold a balance that cannot be withdrawn. it also limits the number of possible shareholders on
     * the contract.
     * */
    receive() external payable {
        if (withdrawn == 0) {
            (bool success, ) = msg.sender.call{
                value: (msg.value - tx.gasprice)
            }("");
            if (!success) {
                revert TransactionFailed();
            }
            emit ReversedTransaction(msg.sender, msg.value);
        } else {
            _distributeReturns();
            emit ExternalTransaction(msg.sender, msg.value);
        }
    }
    /**
     * this fuction allows the creator of a contract to withdraw it's stake
     * @param index the contract number to be sent to the factory
     */
    function unstake(uint256 index)external onlyOwner {
        if((approveUnstake *1e18) < (shareholders.length/4)*1e18 ){revert NotApproved();}
        if(unstaked == 1){revert TransactionFailed();}
        bool success = factory.allowUnstake(index);
        if(success){unstaked = 1;}
    }

    /**
     * this contract allows the creator of a contract to withdraw it's stake
     * @param index the contract number to be sent to the factory
     * this function can only be called during contract cancellation
     */
    function _unstake(uint256 index)internal onlyOwner returns(bool success) {
        if(unstaked == 1){revert YouHaveBeenUnstaked();}
        success = factory.allowUnstake(index);
        if(success){
            return true ;
        }else{
            revert FactoryCouldNotBeUnstaked();
        }
    }

//check this function
    function approveClientUnstake()external {
        address[] memory _approvals = approvals;
        (bool success,) = _isHolder(msg.sender);
        if(success){
        for(uint i = 0; i < _approvals.length; i++){
            if(msg.sender == _approvals[i]){
                revert TransactionFailed();           
                    }                
                }  
            approveUnstake +=1;
            approvals.push(msg.sender); 
            }else{
                revert NotShareHolder();
            }
        }
        
    

    /// @param _newOwner address of the new owner of the contract
    function changeOwner(address _newOwner) external onlyOwner {
        owner = _newOwner;
        shareholders[0] = _newOwner;
        bool success = factory.changeOwner(contractNumber,_newOwner);
        if(success){
            emit OwnerChanged(msg.sender, _newOwner);
        }else{
            revert OwnerCouldNotBeChanged();
        }
    }

    /// @param _shareAmount mininum amount required to recieve ROI from the contract
    function changeShareAmount(uint256 _shareAmount) external onlyOwner {
        assembly {
            sstore(0x02, _shareAmount)
        }
    }
    function changeMinAmount(uint _amount) external onlyOwner {
        minAmount = _amount;
    }

    /// @return tokenAddress : the address of the liquidity provider Tokens
    function getTokenAddress() external view returns (address tokenAddress) {
        tokenAddress = address(liquidityProvider);
    }

    function getAmountNeeded()external view returns(uint amount){
        amount = amountNeeded/1e18;
    }
    function getMinAmount()external view returns(uint _minAmount ){
        _minAmount = minAmount;
    }
    function getShareHolders()external view returns(uint number){
        number = shareholders.length - 1;
    }

    function getContractNumber()external view returns(uint index){
        index = contractNumber;
    }

    function isDonater(address user)public view returns(bool,uint256){
        uint256 amount = donaters[user];
        if (amount > 0){
            return(true, amount);
        } else {
            return (false, amount);
        }
    }    
}
