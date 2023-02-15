// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ICryptoDevs.sol";

error CryptoDevToken_EthNOTEnough(uint requiredAmount, uint valueSent);
error CryptoDevToken_SupplyExceeded();
error CryptoDevToken_BalanceLow();
error CryptoDevToken_AmountLow();

contract CryptoDevToken is ERC20, Ownable {
    ICryptoDevs CryptoDevsNFT;

    // State Variable
    uint public constant TOKEN_PER_NFT = 10 * 10 ** 18;
    uint public constant TOKEN_PRICE = 0.001 ether;
    uint public constant MAX_TOTAL_SUPPLY = 1000 * 10 ** 18;
    mapping(uint256 => bool) public tokenIdsClaimed;

    constructor(address _cryptoDevsContract) ERC20("CryptoDevToken", "CD") {
        CryptoDevsNFT = ICryptoDevs(_cryptoDevsContract);
    }

    function mint(uint amount) public payable {
        uint _requiredAmount = TOKEN_PRICE * amount;
        if (msg.value < _requiredAmount) {
            revert CryptoDevToken_EthNOTEnough(_requiredAmount, msg.value);
        }
        uint amountWithDecimals = amount * 10 ** 18;

        if ((totalSupply() + amountWithDecimals) > MAX_TOTAL_SUPPLY) {
            revert CryptoDevToken_SupplyExceeded();
        }
        _mint(msg.sender, amountWithDecimals);
    }

    function claim() public {
        address sender = msg.sender;
        uint balance = CryptoDevsNFT.balanceOf(sender);
        if (balance == 0) {
            revert CryptoDevToken_BalanceLow();
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
        _mint(msg.sender, amount * TOKEN_PER_NFT);
    }

    receive() external payable {}

    fallback() external payable {}
}
