// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.7;

contract Whitelist {
    // maximum number of addresses which can be whitelisted
    uint8 public maxWhitelistedAddresses;

    // keep track of number of addresses whitelisted till now
    uint8 public numAddressesWhitelisted;

    mapping(address => bool) whitelistedAddress;

    constructor(uint8 _maxWhiteliestedAddresses) {
        maxWhitelistedAddresses = _maxWhiteliestedAddresses;
    }

    function addAddressToWhitelist() public {
        require(
            !whitelistedAddress[msg.sender],
            "Sender already in the whitelist"
        );
        require(
            numAddressesWhitelisted < maxWhitelistedAddresses,
            "Max limit reached"
        );
        whitelistedAddress[msg.sender] = true;
        numAddressesWhitelisted += 1;
    }
}
