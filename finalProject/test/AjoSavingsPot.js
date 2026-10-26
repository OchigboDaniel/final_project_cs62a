const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AjoSavingsPot", () => {
  let pot, a, b, c, outsider, amount;

  beforeEach(async () => {
    [a, b, c, outsider] = await ethers.getSigners();
    amount = ethers.parseEther("0.001");
    pot = await ethers.deployContract("AjoSavingsPot", [
      [a.address, b.address, c.address],
      amount,
    ]);
  });

  it("rotates payouts between members", async () => {
    for (const s of [a, b, c]) await pot.connect(s).contribute({ value: amount });
    await expect(pot.connect(outsider).payout()).to.changeEtherBalance(a, amount * 3n);

    for (const s of [a, b, c]) await pot.connect(s).contribute({ value: amount });
    await expect(pot.connect(outsider).payout()).to.changeEtherBalance(b, amount * 3n);
  });

  it("rejects non-members, wrong amounts and double payment", async () => {
    await expect(pot.connect(outsider).contribute({ value: amount }))
      .to.be.revertedWith("Not a member");
    await expect(pot.connect(a).contribute({ value: 1n }))
      .to.be.revertedWith("Wrong contribution amount");
    await pot.connect(a).contribute({ value: amount });
    await expect(pot.connect(a).contribute({ value: amount }))
      .to.be.revertedWith("Already paid this round");
  });

  it("blocks payout before everyone has paid", async () => {
    await pot.connect(a).contribute({ value: amount });
    await expect(pot.payout()).to.be.revertedWith("Not everyone has paid");
  });
});