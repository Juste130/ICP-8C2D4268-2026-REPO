const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC20Token", function () {
  let token, owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("ERC20Token");
    token = await Token.deploy();
    await token.waitForDeployment();
  });

  it("has correct name, symbol and owner holds total supply", async function () {
    expect(await token.name()).to.equal("MyJusteToken");
    expect(await token.symbol()).to.equal("MJT");
    const totalSupply = await token.totalSupply();
    const ownerBalance = await token.balanceOf(owner.address);
    expect(ownerBalance).to.equal(totalSupply);
  });

  it("allows owner to mint and forbids non-owner", async function () {
    const amount = ethers.parseUnits("1000", 18);
    await token.mint(addr1.address, amount);
    expect(await token.balanceOf(addr1.address)).to.equal(amount);
    await expect(token.connect(addr1).mint(addr1.address, 1)).to.be.reverted;
  });

  it("burn reduces balance", async function () {
    const burnAmount = ethers.parseUnits("10", 18);
    const initial = await token.balanceOf(owner.address);
    await token.burn(burnAmount);
    const after = await token.balanceOf(owner.address);
    expect(after).to.equal(initial - burnAmount);
  });
});
