// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Good {
    address public helper;
    address public owner;
    uint public num;

    constructor(address _helper) {
        helper = _helper;
        owner = msg.sender;
    }

    function setNum(uint _num) public {
        helper.delegatecall(abi.encodeWithSignature("setNum(uint256)", _num));
    }
}

// The important thing to note when using .delegatecall() is that the context the original contract passes to the target, and all state changes in the target contract reflect on the original contract's state and not on the target contract's state even though the function is being executed on the target contract.

// Actual Use Cases

// .delegatecall() is heavily used within proxy (upgradeable) contracts. Since smart contracts are not upgradeable by default, the way to make them upgradeable is typically by having one storage contract containing an address for an implementation contract that does not change. If you wanted to update your contract code, you change the address of the implementation contract to something new. The storage contract makes all calls using .delegatecall() which allows to run different versions of the code while maintaining the same persisted storage over time, no matter how many implementation contracts you change. Therefore, the logic can change, but the data is never fragmented.
