import { ethers } from "hardhat";
import "dotenv/config";

async function main() {
  const initialOwner = process.env.INITIAL_OWNER || "";

  if (!initialOwner) {
    throw new Error("INITIAL_OWNER not set in .env file");
  }

  console.log("Deploying ClarusToken...");
  console.log("Initial Owner:", initialOwner);

  const TokenFactory = await ethers.getContractFactory("ClarusToken");
  const token = await TokenFactory.deploy(initialOwner);
  await token.waitForDeployment();

  const tokenAddress = await token.getAddress();
  console.log("ClarusToken deployed to:", tokenAddress);

  // Display deployment info
  const totalSupply = await token.totalSupply();
  console.log("Total Supply:", ethers.formatUnits(totalSupply, 18), "CLA");
  console.log("Owner Balance:", ethers.formatUnits(await token.balanceOf(initialOwner), 18), "CLA");

  console.log("\nDeployment Summary:");
  console.log("===================");
  console.log("Token Address:", tokenAddress);
  console.log("Initial Owner:", initialOwner);
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId);

  console.log("\nNext steps:");
  console.log("1. Verify contract on BscScan: npm run verify:mainnet");
  console.log("2. Update site/index.html with contract address");
  console.log("3. Deploy vesting contracts if needed: npm run vesting:deploy");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
