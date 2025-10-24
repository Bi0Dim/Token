import { expect } from "chai";
import { ethers } from "hardhat";
import { ClarusToken, BatchVestingFactory, LinearVesting } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("BatchVestingFactory", function () {
  let token: ClarusToken;
  let factory: BatchVestingFactory;
  let owner: SignerWithAddress;
  let beneficiary1: SignerWithAddress;
  let beneficiary2: SignerWithAddress;
  let beneficiary3: SignerWithAddress;

  const CLIFF_DURATION = 365 * 24 * 60 * 60; // 1 year
  const VESTING_DURATION = 4 * 365 * 24 * 60 * 60; // 4 years

  beforeEach(async function () {
    [owner, beneficiary1, beneficiary2, beneficiary3] = await ethers.getSigners();

    // Deploy token
    const TokenFactory = await ethers.getContractFactory("ClarusToken");
    token = await TokenFactory.deploy(owner.address);
    await token.waitForDeployment();

    // Deploy factory
    const FactoryContract = await ethers.getContractFactory("BatchVestingFactory");
    factory = await FactoryContract.deploy(await token.getAddress(), owner.address);
    await factory.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set correct token and owner", async function () {
      expect(await factory.token()).to.equal(await token.getAddress());
      expect(await factory.owner()).to.equal(owner.address);
    });

    it("Should revert if token is zero address", async function () {
      const FactoryContract = await ethers.getContractFactory("BatchVestingFactory");
      await expect(
        FactoryContract.deploy(ethers.ZeroAddress, owner.address)
      ).to.be.revertedWith("BatchVestingFactory: token is zero address");
    });
  });

  describe("Single Vesting Creation", function () {
    it("Should create a single vesting contract", async function () {
      const amount = ethers.parseUnits("100000", 18);
      const currentTime = await time.latest();

      await token.approve(await factory.getAddress(), amount);

      const tx = await factory.createVesting(
        beneficiary1.address,
        amount,
        currentTime,
        CLIFF_DURATION,
        VESTING_DURATION
      );

      const receipt = await tx.wait();
      const event = receipt?.logs.find(
        (log: any) => log.fragment && log.fragment.name === "VestingCreated"
      );

      expect(event).to.not.be.undefined;
    });

    it("Should revert if not called by owner", async function () {
      const amount = ethers.parseUnits("100000", 18);
      const currentTime = await time.latest();

      await expect(
        factory
          .connect(beneficiary1)
          .createVesting(
            beneficiary1.address,
            amount,
            currentTime,
            CLIFF_DURATION,
            VESTING_DURATION
          )
      ).to.be.revertedWithCustomError(factory, "OwnableUnauthorizedAccount");
    });
  });

  describe("Batch Vesting Creation", function () {
    it("Should create multiple vesting contracts", async function () {
      const beneficiaries = [beneficiary1.address, beneficiary2.address, beneficiary3.address];
      const amounts = [
        ethers.parseUnits("100000", 18),
        ethers.parseUnits("200000", 18),
        ethers.parseUnits("300000", 18),
      ];
      const totalAmount = amounts.reduce((a, b) => a + b, 0n);
      const currentTime = await time.latest();

      await token.approve(await factory.getAddress(), totalAmount);

      const tx = await factory.createVestingBatch(
        beneficiaries,
        amounts,
        currentTime,
        CLIFF_DURATION,
        VESTING_DURATION
      );

      const receipt = await tx.wait();
      const events = receipt?.logs.filter(
        (log: any) => log.fragment && log.fragment.name === "VestingCreated"
      );

      expect(events).to.have.lengthOf(3);
    });

    it("Should revert if arrays have different lengths", async function () {
      const beneficiaries = [beneficiary1.address, beneficiary2.address];
      const amounts = [ethers.parseUnits("100000", 18)]; // Mismatch
      const currentTime = await time.latest();

      await expect(
        factory.createVestingBatch(
          beneficiaries,
          amounts,
          currentTime,
          CLIFF_DURATION,
          VESTING_DURATION
        )
      ).to.be.revertedWith("BatchVestingFactory: length mismatch");
    });

    it("Should revert if arrays are empty", async function () {
      const beneficiaries: string[] = [];
      const amounts: bigint[] = [];
      const currentTime = await time.latest();

      await expect(
        factory.createVestingBatch(
          beneficiaries,
          amounts,
          currentTime,
          CLIFF_DURATION,
          VESTING_DURATION
        )
      ).to.be.revertedWith("BatchVestingFactory: empty arrays");
    });

    it("Should revert if not called by owner", async function () {
      const beneficiaries = [beneficiary1.address];
      const amounts = [ethers.parseUnits("100000", 18)];
      const currentTime = await time.latest();

      await expect(
        factory
          .connect(beneficiary1)
          .createVestingBatch(
            beneficiaries,
            amounts,
            currentTime,
            CLIFF_DURATION,
            VESTING_DURATION
          )
      ).to.be.revertedWithCustomError(factory, "OwnableUnauthorizedAccount");
    });

    it("Should distribute tokens correctly to vesting contracts", async function () {
      const beneficiaries = [beneficiary1.address, beneficiary2.address];
      const amounts = [ethers.parseUnits("100000", 18), ethers.parseUnits("200000", 18)];
      const totalAmount = amounts.reduce((a, b) => a + b, 0n);
      const currentTime = await time.latest();

      await token.approve(await factory.getAddress(), totalAmount);

      const tx = await factory.createVestingBatch(
        beneficiaries,
        amounts,
        currentTime,
        CLIFF_DURATION,
        VESTING_DURATION
      );

      const receipt = await tx.wait();
      const events = receipt?.logs.filter(
        (log: any) => log.fragment && log.fragment.name === "VestingCreated"
      );

      // Check that each vesting contract has the correct amount
      for (let i = 0; i < events!.length; i++) {
        const vestingAddress = events![i].args![0];
        const vestingBalance = await token.balanceOf(vestingAddress);
        expect(vestingBalance).to.equal(amounts[i]);
      }
    });
  });
});
