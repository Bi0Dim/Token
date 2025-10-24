import { expect } from "chai";
import { ethers } from "hardhat";
import { ClarusToken } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("ClarusToken", function () {
  let token: ClarusToken;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  const TOTAL_SUPPLY = ethers.parseUnits("100000000", 18); // 100 million tokens

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const TokenFactory = await ethers.getContractFactory("ClarusToken");
    token = await TokenFactory.deploy(owner.address);
    await token.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should have correct name and symbol", async function () {
      expect(await token.name()).to.equal("Quaxis Clarus");
      expect(await token.symbol()).to.equal("CLA");
    });

    it("Should have 18 decimals", async function () {
      expect(await token.decimals()).to.equal(18);
    });

    it("Should mint total supply to initial owner", async function () {
      expect(await token.totalSupply()).to.equal(TOTAL_SUPPLY);
      expect(await token.balanceOf(owner.address)).to.equal(TOTAL_SUPPLY);
    });

    it("Should revert if initial owner is zero address", async function () {
      const TokenFactory = await ethers.getContractFactory("ClarusToken");
      await expect(TokenFactory.deploy(ethers.ZeroAddress)).to.be.revertedWith(
        "ClarusToken: initial owner is zero address"
      );
    });
  });

  describe("ERC20 Functionality", function () {
    it("Should transfer tokens between accounts", async function () {
      const amount = ethers.parseUnits("1000", 18);
      await token.transfer(addr1.address, amount);
      expect(await token.balanceOf(addr1.address)).to.equal(amount);
    });

    it("Should allow approved spending", async function () {
      const amount = ethers.parseUnits("1000", 18);
      await token.approve(addr1.address, amount);
      expect(await token.allowance(owner.address, addr1.address)).to.equal(amount);

      await token.connect(addr1).transferFrom(owner.address, addr2.address, amount);
      expect(await token.balanceOf(addr2.address)).to.equal(amount);
    });
  });

  describe("ERC20Permit (EIP-2612)", function () {
    it("Should have correct domain separator", async function () {
      const domain = await token.DOMAIN_SEPARATOR();
      expect(domain).to.not.equal(ethers.ZeroHash);
    });

    it("Should allow permit approval", async function () {
      const amount = ethers.parseUnits("1000", 18);
      const deadline = ethers.MaxUint256;

      // Get the current nonce
      const nonce = await token.nonces(owner.address);

      // Create permit signature
      const domain = {
        name: await token.name(),
        version: "1",
        chainId: (await ethers.provider.getNetwork()).chainId,
        verifyingContract: await token.getAddress(),
      };

      const types = {
        Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      };

      const value = {
        owner: owner.address,
        spender: addr1.address,
        value: amount,
        nonce: nonce,
        deadline: deadline,
      };

      const signature = await owner.signTypedData(domain, types, value);
      const sig = ethers.Signature.from(signature);

      // Use permit
      await token.permit(owner.address, addr1.address, amount, deadline, sig.v, sig.r, sig.s);

      expect(await token.allowance(owner.address, addr1.address)).to.equal(amount);
    });

    it("Should increment nonce after permit", async function () {
      const amount = ethers.parseUnits("1000", 18);
      const deadline = ethers.MaxUint256;
      const initialNonce = await token.nonces(owner.address);

      const domain = {
        name: await token.name(),
        version: "1",
        chainId: (await ethers.provider.getNetwork()).chainId,
        verifyingContract: await token.getAddress(),
      };

      const types = {
        Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      };

      const value = {
        owner: owner.address,
        spender: addr1.address,
        value: amount,
        nonce: initialNonce,
        deadline: deadline,
      };

      const signature = await owner.signTypedData(domain, types, value);
      const sig = ethers.Signature.from(signature);

      await token.permit(owner.address, addr1.address, amount, deadline, sig.v, sig.r, sig.s);

      expect(await token.nonces(owner.address)).to.equal(initialNonce + 1n);
    });
  });
});
