// SPDX-License-Identifier: MIT

pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Base64} from "./libraries/Base64.sol";

contract Money {
    event Deposit(address indexed user, uint256 etherAmount, uint256 time);
    function deposit() public {
        emit Deposit(msg.sender, 30, block.timestamp);
    }
}
