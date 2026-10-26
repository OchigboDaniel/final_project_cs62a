const hre = require("hardhat");

async function main() {
  const MessageBoard = await hre.ethers.getContractFactory("MessageBoard");
  const messageBoard = await MessageBoard.deploy();
  await messageBoard.waitForDeployment();

  console.log("MessageBoard deployed to:", await messageBoard.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});