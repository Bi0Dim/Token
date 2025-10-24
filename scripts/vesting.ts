import { ethers } from "hardhat";
import "dotenv/config";

async function main() {
  const tokenAddress = process.argv[2];
  const factoryOwner = process.env.INITIAL_OWNER || "";

  if (!tokenAddress) {
    throw new Error("Please provide token address as argument");
  }

  if (!factoryOwner) {
    throw new Error("INITIAL_OWNER not set in .env file");
  }

  console.log("Deploying BatchVestingFactory...");
  console.log("Token Address:", tokenAddress);
  console.log("Factory Owner:", factoryOwner);

  const FactoryContract = await ethers.getContractFactory("BatchVestingFactory");
  const factory = await FactoryContract.deploy(tokenAddress, factoryOwner);
  await factory.waitForDeployment();

  const factoryAddress = await factory.getAddress();
  console.log("BatchVestingFactory deployed to:", factoryAddress);

  console.log("\nDeployment Summary:");
  console.log("===================");
  console.log("Factory Address:", factoryAddress);
  console.log("Token Address:", tokenAddress);
  console.log("Owner:", factoryOwner);
  console.log("Network:", (await ethers.provider.getNetwork()).name);

  console.log("\nNext steps:");
  console.log("1. Approve factory to spend tokens");
  console.log("2. Call createVestingBatch or createVesting with beneficiary details");
  console.log("3. See docs/launch/parameters.example.json for example parameters");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
