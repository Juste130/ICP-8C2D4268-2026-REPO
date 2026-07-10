const hre = require("hardhat");

async function main() {
  const args = process.argv.slice(2);
  const addressFlagIndex = args.indexOf("--address");
  const contractAddress = addressFlagIndex !== -1 && args[addressFlagIndex + 1]
    ? args[addressFlagIndex + 1]
    : process.env.CONTRACT_ADDRESS;

  if (!contractAddress) {
    throw new Error("Usage: npx hardhat run --network <network> scripts/verify.js --address <contractAddress> or set CONTRACT_ADDRESS in your environment.");
  }
  console.log("Verifying contract at", contractAddress, "on network", hre.network.name);

  await hre.run("verify:verify", {
    address: contractAddress,
    constructorArguments: []
  });

  console.log("Verification request sent.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
