// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Exchange {

    address public owner;

    uint256  tokenprice = 1600;

    IERC20 public Apad;

    event Buy(address sender,uint256 Totalpurchase);
    event Sell(address  receiver, address sender, uint256 totalsell);

    constructor(address token){
        owner = msg.sender;
        Apad = IERC20(token);
    }

    function buy() external payable {
        require(Apad.balanceOf(address(this)) >= msg.value*tokenprice);
        Apad.transfer(msg.sender,msg.value*tokenprice);
        emit Buy(msg.sender,msg.value*tokenprice);
    }

    function sell(uint256 _amount) external{
        require(Apad.balanceOf(msg.sender)>=_amount);
        Apad.transferFrom(msg.sender, address(this),_amount);
        payable(msg.sender).transfer(_amount / tokenprice);
        emit Sell(msg.sender ,address(this),_amount/tokenprice);
    }

}