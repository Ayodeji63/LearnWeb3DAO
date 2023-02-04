// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CryptoDevs is ERC721Enumerable, Ownable {
    constructor(
        string memory _baseURI,
        address whitelistContract
    ) ERC721("CryptoDevs", "CD") {}
}
