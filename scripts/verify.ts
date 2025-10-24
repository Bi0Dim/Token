import { run } from "hardhat";
import "dotenv/config";

async function main() {
  const tokenAddress = process.argv[2];
  const initialOwner = process.env.INITIAL_OWNER || "";

  if (!tokenAddress) {
    throw new Error("Please provide token address as argument: npm run verify:mainnet <address>");
  }

  if (!initialOwner) {
    throw new Error("INITIAL_OWNER not set in .env file");
  }

  console.log("Verifying ClarusToken on BscScan...");
  console.log("Contract Address:", tokenAddress);
  console.log("Constructor Args:", initialOwner);

  try {
    await run("verify:verify", {
      address: tokenAddress,
      constructorArguments: [initialOwner],
    });
    console.log("Contract verified successfully!");
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log("Contract is already verified!");
    } else {
      console.error("Verification failed:", error);
      throw error;
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
