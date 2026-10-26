const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MessageBoard", function () {
  let messageBoard;

  beforeEach(async function () {
    const MessageBoard = await ethers.getContractFactory("MessageBoard");
    messageBoard = await MessageBoard.deploy();
    await messageBoard.waitForDeployment();
  });

  it("returns an empty string right after deployment", async function () {
    expect(await messageBoard.getMessage()).to.equal("");
  });

  it("returns the new message after setMessage", async function () {
    const tx = await messageBoard.setMessage("hello world");
    await tx.wait();

    expect(await messageBoard.getMessage()).to.equal("hello world");
  });
});