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
    uint public constant tokenPrice = 0.001 ether;
    uint public constant maxTotalSupply = 10000 * 10 ** 18;

    mapping(uint256 => bool) public tokenIdsClaimed;

    constructor(address _cryptoDevsContract) ERC20("CryptoDevToken", "CD") {
        CryptoDevsNFT = ICryptoDevs(_cryptoDevsContract);
    }

    function mint(uint amount) public payable {
        uint _requiredAmount = tokenPrice * amount;
        if (msg.value < _requiredAmount) {
            revert CryptoDevToken_EthNOTEnough(_requiredAmount, msg.value);
        }
        uint amountWithDecimals = amount * 10 ** 18;

        if ((totalSupply() + amountWithDecimals) > maxTotalSupply) {
            revert CryptoDevToken_SupplyExceeded();
        }
        _mint(msg.sender, amountWithDecimals);
    }

    function claim() public {
        address sender = msg.sender;
        uint balance = CryptoDevsNFT.balanceOf(sender);
        if (balance == 0) {
            revert CryptoDevToken_BalanceLow(balance);
        }
        uint amount = 0;

        for (uint i = 0; i < balance; i++) {
            uint tokenId = CryptoDevsNFT.tokenOfOwnerByIndex(sender, i);
            if (!tokenIdsClaimed[tokenId]) {
                amount += 1;
                tokenIdsClaimed[tokenId] = true;
            }
        }

        if (amount == 0) {
            revert CryptoDevToken_AmountLow();
        }
        _mint(msg.sender, amount * tokensPerNFT);
    }

    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        address _owner = owner();
        if (amount == 0) {
            revert CryptoDevToken_BalanceLow(amount);
        }
        (bool sent, ) = _owner.call{value: amount}("");
        if (!sent) {
            revert CryptoDevToken_NotSent();
        }
    }

    receive() external payable {}

    fallback() external payable {}
}
