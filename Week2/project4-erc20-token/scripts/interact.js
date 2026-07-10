const hre = require("hardhat");

async function main() {
  const args = process.argv.slice(2);
  const addressFlagIndex = args.indexOf("--address");
  const tokenAddress = addressFlagIndex !== -1 && args[addressFlagIndex + 1]
    ? args[addressFlagIndex + 1]
    : process.env.CONTRACT_ADDRESS;

  if (!tokenAddress) {
    throw new Error("Usage: npx hardhat run --network <network> scripts/interact.js --address <contractAddress> or set CONTRACT_ADDRESS in your environment.");
  }
  const [signer] = await hre.ethers.getSigners();

  console.log("Interacting from", signer.address);
  const token = await hre.ethers.getContractAt("ERC20Token", tokenAddress, signer);

  const name = await token.name();
  const symbol = await token.symbol();
  const totalSupply = await token.totalSupply();
  const ownerBalance = await token.balanceOf(signer.address);

  console.log("Token:", name, symbol);
  console.log("Total supply:", totalSupply.toString());
  console.log("Signer balance:", ownerBalance.toString());

  // Example interaction: burn 1 token from signer if they have any.
  const burnAmount = hre.ethers.parseUnits("1", 18);
  if (ownerBalance >= burnAmount) {
    console.log("Burning 1 token from signer...");
    const tx = await token.burn(burnAmount);
    await tx.wait();
    console.log("Burn transaction sent:", tx.hash);
  } else {
    console.log("Signer balance too low to burn 1 token.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
