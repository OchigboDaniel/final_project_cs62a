const hre = require("hardhat");

async function main() {
  const members = [process.env.MEMBER1, process.env.MEMBER2, process.env.MEMBER3];
  const contribution = hre.ethers.parseEther("0.001");

  const pot = await hre.ethers.deployContract("AjoSavingsPot", [members, contribution]);
  await pot.waitForDeployment();

  console.log("AjoSavingsPot deployed to:", await pot.getAddress());
}

main().catch((e) => { console.error(e); process.exit(1); });