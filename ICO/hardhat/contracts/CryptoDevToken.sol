// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ICryptoDevs.sol";

contract CryptoDevToken is ERC20, Ownable {
    ICryptoDevs CryptoDevsNFT;

    uint public constant tokenPerNFT = 10 * 10 ** 18;
    uint public constant tokenPrice = 0.001 ether;
    uint maxTotalSupply = 1000 * 10 ** 18;
    mapping(uint256 => bool) public tokenIdsClaimed;

    constructor(address _cryptoDevsContract) ERC20("CryptoDevToken", "CD") {
        CryptoDevsNFT = ICryptoDevs(_cryptoDevsContract);
    }

    function mint(uint amount) public payable {
        uint256 _requiredAmount = tokenPrice * amount;
        require(msg.value >= _requiredAmount, "Ether sent is incorrect");
        uint amountWithDecimals = amount * 1 ** 18;
        require(
            totalSupply() + amountWithDecimals <= maxTotalSupply,
            "Exceeds the max total supply available"
        );
        _mint(msg.sender, amountWithDecimals);
    }

    function claim() public {
        address sender = msg.sender;
        uint256 balance = CryptoDevsNFT.balanceOf(sender);
        require(balance > 0, "You dont own any Crypto Drv NFT's");
        uint amount = 0;

        for (uint i = 0; i < balance; i++) {
            uint tokenId = CryptoDevsNFT.tokenOfOwnerByIndex(sender, i);
            if (!tokenIdsClaimed[tokenId]) {
                amount += 1;
                tokenIdsClaimed[tokenId] = true;
            }
        }

        require(amount > 0, "You have already claimed all your tokens");
        _mint(msg.sender, amount * tokenPerNFT);
    }

    receive() external payable {}

    fallback() external payable {}
}
