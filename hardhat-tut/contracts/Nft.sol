// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor() ERC20("Token", "TN") {
        _mint(msg.sender, 10e24);
        // 1_000_000;  1 eth === 1e18 Wei
        //  1_000_000 eht = 1e24
    }
}
