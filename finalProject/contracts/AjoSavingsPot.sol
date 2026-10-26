// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AjoSavingsPot {
    address[3] public members;
    uint256 public immutable contribution;
    uint256 public currentRound;
    uint256 public contributionsCount;

    // round member paid?
    mapping(uint256 => mapping(address => bool)) public hasPaid;

    event Contributed(address indexed member, uint256 indexed round);
    event PaidOut(address indexed recipient, uint256 amount, uint256 indexed round);

    constructor(address[3] memory _members, uint256 _contribution) {
        require(_contribution > 0, "Contribution must be > 0");
        members = _members;
        contribution = _contribution;
    }

    function isMember(address a) public view returns (bool) {
        for (uint256 i = 0; i < 3; i++) {
            if (members[i] == a) return true;
        }
        return false;
    }

    function contribute() external payable {
        require(isMember(msg.sender), "Not a member");
        require(!hasPaid[currentRound][msg.sender], "Already paid this round");
        require(msg.value == contribution, "Wrong contribution amount");

        hasPaid[currentRound][msg.sender] = true;
        contributionsCount++;
        emit Contributed(msg.sender, currentRound);
    }

    function payout() external {
        require(contributionsCount == 3, "Not everyone has paid");

        address recipient = members[currentRound % 3];
        uint256 pot = contribution * 3;
        uint256 round = currentRound;

        // effects before interaction
        currentRound++;
        contributionsCount = 0;

        (bool ok, ) = recipient.call{value: pot}("");
        require(ok, "Transfer failed");
        emit PaidOut(recipient, pot, round);
    }
}