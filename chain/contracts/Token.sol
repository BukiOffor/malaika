// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";


error NotCaller();

contract Token is ERC20, ERC20Permit,ERC20Votes {
    address immutable caller;
    
    constructor(uint256 initialSupply) ERC20("Liquidity Provider", "LP")ERC20Permit("Liquidity Provider") {
        _mint(msg.sender, initialSupply);
        caller = msg.sender;

    }

    /// @notice The functions below are overrides required by Solidity because of the ERC20votes 

    function _afterTokenTransfer(address from, address to, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._burn(account, amount);
    }

    function approve(address owner, address spender, uint256 amount) public {
        if(msg.sender != caller){
            revert NotCaller(); 
            }
        super._approve(owner,spender,amount);
    }

    //TO DO
    //deprecate transfer functions in the token contract to make sure tokens are transferred 
    //using the crowdsource transfer function
}
