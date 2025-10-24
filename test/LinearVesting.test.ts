import { expect } from "chai";
import { ethers } from "hardhat";
import { ClarusToken, LinearVesting } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("LinearVesting", function () {
  let token: ClarusToken;
  let vesting: LinearVesting;
  let owner: SignerWithAddress;
  let beneficiary: SignerWithAddress;

  const VESTING_AMOUNT = ethers.parseUnits("1000000", 18); // 1 million tokens
  const CLIFF_DURATION = 365 * 24 * 60 * 60; // 1 year in seconds
  const VESTING_DURATION = 4 * 365 * 24 * 60 * 60; // 4 years in seconds

  beforeEach(async function () {
    [owner, beneficiary] = await ethers.getSigners();

    // Deploy token
    const TokenFactory = await ethers.getContractFactory("ClarusToken");
    token = await TokenFactory.deploy(owner.address);
    await token.waitForDeployment();

    // Get current timestamp
    const currentTime = await time.latest();

    // Deploy vesting contract
    const VestingFactory = await ethers.getContractFactory("LinearVesting");
    vesting = await VestingFactory.deploy(
      await token.getAddress(),
      beneficiary.address,
      currentTime,
      CLIFF_DURATION,
      VESTING_DURATION,
      VESTING_AMOUNT
    );
    await vesting.waitForDeployment();

    // Transfer tokens to vesting contract
    await token.transfer(await vesting.getAddress(), VESTING_AMOUNT);
  });

  describe("Deployment", function () {
    it("Should set correct parameters", async function () {
      expect(await vesting.token()).to.equal(await token.getAddress());
      expect(await vesting.beneficiary()).to.equal(beneficiary.address);
      expect(await vesting.totalAmount()).to.equal(VESTING_AMOUNT);
      expect(await vesting.released()).to.equal(0);
    });

    it("Should revert if token is zero address", async function () {
      const currentTime = await time.latest();
      const VestingFactory = await ethers.getContractFactory("LinearVesting");
      await expect(
        VestingFactory.deploy(
          ethers.ZeroAddress,
          beneficiary.address,
          currentTime,
          CLIFF_DURATION,
          VESTING_DURATION,
          VESTING_AMOUNT
        )
      ).to.be.revertedWith("LinearVesting: token is zero address");
    });

    it("Should revert if beneficiary is zero address", async function () {
      const currentTime = await time.latest();
      const VestingFactory = await ethers.getContractFactory("LinearVesting");
      await expect(
        VestingFactory.deploy(
          await token.getAddress(),
          ethers.ZeroAddress,
          currentTime,
          CLIFF_DURATION,
          VESTING_DURATION,
          VESTING_AMOUNT
        )
      ).to.be.revertedWith("LinearVesting: beneficiary is zero address");
    });

    it("Should revert if duration is 0", async function () {
      const currentTime = await time.latest();
      const VestingFactory = await ethers.getContractFactory("LinearVesting");
      await expect(
        VestingFactory.deploy(
          await token.getAddress(),
          beneficiary.address,
          currentTime,
          CLIFF_DURATION,
          0,
          VESTING_AMOUNT
        )
      ).to.be.revertedWith("LinearVesting: duration is 0");
    });

    it("Should revert if cliff is longer than duration", async function () {
      const currentTime = await time.latest();
      const VestingFactory = await ethers.getContractFactory("LinearVesting");
      await expect(
        VestingFactory.deploy(
          await token.getAddress(),
          beneficiary.address,
          currentTime,
          VESTING_DURATION + 1,
          VESTING_DURATION,
          VESTING_AMOUNT
        )
      ).to.be.revertedWith("LinearVesting: cliff longer than duration");
    });
  });

  describe("Vesting Behavior", function () {
    it("Should not release tokens before cliff", async function () {
      expect(await vesting.vestedAmount()).to.equal(0);
      expect(await vesting.releasableAmount()).to.equal(0);
    });

    it("Should not allow release before cliff", async function () {
      await expect(vesting.release()).to.be.revertedWith("LinearVesting: no tokens to release");
    });

    it("Should release tokens after cliff", async function () {
      // Move time to just after cliff
      await time.increase(CLIFF_DURATION + 1);

      const vestedAmount = await vesting.vestedAmount();
      expect(vestedAmount).to.be.gt(0);

      const releasable = await vesting.releasableAmount();
      expect(releasable).to.equal(vestedAmount);

      // Release tokens
      await expect(vesting.release())
        .to.emit(vesting, "TokensReleased")
        .withArgs(releasable);

      expect(await token.balanceOf(beneficiary.address)).to.equal(releasable);
      expect(await vesting.released()).to.equal(releasable);
    });

    it("Should vest linearly over time", async function () {
      // Move to halfway point
      await time.increase(VESTING_DURATION / 2);

      const vestedAmount = await vesting.vestedAmount();
      const expectedAmount = VESTING_AMOUNT / 2n;

      // Allow for small rounding differences
      expect(vestedAmount).to.be.closeTo(expectedAmount, ethers.parseUnits("1", 18));
    });

    it("Should release all tokens by end of vesting period", async function () {
      // Move to end of vesting period
      await time.increase(VESTING_DURATION + 1);

      expect(await vesting.vestedAmount()).to.equal(VESTING_AMOUNT);

      await vesting.release();

      expect(await token.balanceOf(beneficiary.address)).to.equal(VESTING_AMOUNT);
      expect(await vesting.released()).to.equal(VESTING_AMOUNT);
      expect(await vesting.releasableAmount()).to.equal(0);
    });

    it("Should allow multiple releases", async function () {
      // First release after cliff
      await time.increase(CLIFF_DURATION + 1);
      const firstRelease = await vesting.releasableAmount();
      await vesting.release();
      expect(await vesting.released()).to.equal(firstRelease);

      // Second release halfway through
      await time.increase(VESTING_DURATION / 4);
      const secondRelease = await vesting.releasableAmount();
      await vesting.release();
      expect(await vesting.released()).to.equal(firstRelease + secondRelease);

      // Final release at end
      await time.increase(VESTING_DURATION);
      await vesting.release();
      expect(await vesting.released()).to.equal(VESTING_AMOUNT);
    });
  });
});
