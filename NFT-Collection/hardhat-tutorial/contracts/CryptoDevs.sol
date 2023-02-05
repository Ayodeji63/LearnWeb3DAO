// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IWhitelist.sol";

contract CryptoDevs is ERC721Enumerable, Ownable {
    string _baseTokenURI;
    IWhitelist whitelist;

    bool public presaleStarted;
    uint256 public presalended;
    uint256 public maxTokenIds = 20;
    uint256 public tokenId;
    uint256 public _publicPrice = 0.01 ether;
    uint256 public _presalePrice = 0.005 ether;
    bool public _paused;

    modifier onlyWhenNotPaused() {
        require(!_paused, "Contract currently paused");
        _;
    }

    constructor(
        string memory _basetokenURI,
        address whitelistContract
    ) ERC721("CryptoDevs", "CD") {
        _baseTokenURI = _basetokenURI;
        whitelist = IWhitelist(whitelistContract);
    }

    function startPresale() public onlyOwner {
        presaleStarted = true;
        presalended = block.timestamp + 5 minutes;
    }

    function preSaleMint() public payable onlyWhenNotPaused {
        require(
            presaleStarted && block.timestamp < presalended,
            "Presale ended"
        );
        require(
            whitelist.whitelistedAddress(msg.sender),
            "You are not in whitelist"
        );
        require(tokenId < maxTokenIds, "Exceeded the limit");
        require(msg.value >= _presalePrice, "Ether sent is not correct");

        tokenId += 1;
        _safeMint(msg.sender, tokenId);
    }

    function mint() public payable onlyWhenNotPaused {
        require(
            presaleStarted && block.timestamp >= presalended,
            "Presale has not ended yet"
        );
        require(tokenId < maxTokenIds, "Exceeded the limit");
        require(msg.value >= _publicPrice, "Ether sent is not correct");
        tokenId += 1;

        _safeMint(msg.sender, tokenId);
    }

    function setPaused(bool val) public onlyOwner {
        _paused = val;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function withdraw() public onlyOwner {
        address _owner = owner();
        uint256 amount = address(this).balance;
        (bool sent, ) = _owner.call{value: amount}("");
        require(sent, "Failed to send ether");
    }

    receive() external payable {}

    fallback() external payable {}
}
