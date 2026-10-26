// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MessageBoard {
    string private message;

    function setMessage(string calldata newMessage) external {
        message = newMessage;
    }

    function getMessage() external view returns (string memory) {
        return message;
    }
}