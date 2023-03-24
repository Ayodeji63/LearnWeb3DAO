// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ICryptoDevs.sol";

error CryptoDevToken_EthNOTEnough(uint requiredAmount, uint valueSent);
error CryptoDevToken_SupplyExceeded();
error CryptoDevToken_BalanceLow(uint amount);
error CryptoDevToken_AmountLow();
error CryptoDevToken_NotSent();

contract CryptoDevToken is ERC20, Ownable {
    ICryptoDevs CryptoDevsNFT;

    // State Variable
    uint public constant tokensPerNFT = 10 * 10 ** 18;
    uint public constant tokenPrice = 0.0001 ether;
    uint public constant maxTotalSupply = 10000 * 10 ** 18;

    mapping(uint256 => bool) public tokenIdsClaimed;

    constructor(address _cryptoDevsContract) ERC20("CryptoDevToken", "CD") {
        CryptoDevsNFT = ICryptoDevs(_cryptoDevsContract);
    }

    function mint(uint amount) public payable {
        uint _requiredAmount = tokenPrice * amount;
        // if (msg.value < _requiredAmount) {
        //     revert CryptoDevToken_EthNOTEnough(_requiredAmount, msg.value);
        // }
        require(msg.value >= _requiredAmount, "Ether sent is incorrect");
        uint amountWithDecimals = amount * 10 ** 18;

        // if ((totalSupply() + amountWithDecimals) > maxTotalSupply) {
        //     revert CryptoDevToken_SupplyExceeded();
        // }
        require(
            (totalSupply() + amountWithDecimals) <= maxTotalSupply,
            "Exceeds the max total supply available."
        );
        _mint(msg.sender, amountWithDecimals);
    }

    function claim() public payable {
        address sender = msg.sender;
        uint balance = CryptoDevsNFT.balanceOf(sender);
        require(balance > 0, "You don't own any Crypto Dev NFT");
        uint amount = 0;

        for (uint i = 0; i < balance; i++) {
            uint tokenId = CryptoDevsNFT.tokenOfOwnerByIndex(sender, i);
            if (!tokenIdsClaimed[tokenId]) {
                amount += 1;
                tokenIdsClaimed[tokenId] = true;
            }
        }

        require(amount > 0, "You have already claimed all the tokens");

        _mint(msg.sender, amount * tokensPerNFT);
    }

    // function withdraw() public onlyOwner {
    //     uint256 amount = address(this).balance;
    //     address _owner = owner();
    //     if (amount == 0) {
    //         revert CryptoDevToken_BalanceLow(amount);
    //     }
    //     (bool sent, ) = _owner.call{value: amount}("");
    //     if (!sent) {
    //         revert CryptoDevToken_NotSent();
    //     }
    // }
    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "Nothing to withdraw, contract balance empty");

        address _owner = owner();
        (bool sent, ) = _owner.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    receive() external payable {}

    fallback() external payable {}
}
