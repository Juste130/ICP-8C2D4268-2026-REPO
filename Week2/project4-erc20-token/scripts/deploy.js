const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const ERC20Token = await hre.ethers.getContractFactory("ERC20Token");
  const token = await ERC20Token.deploy();
  await token.waitForDeployment();

  console.log("ERC20Token deployed to:", token.target);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
