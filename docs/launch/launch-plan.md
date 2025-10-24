# Quaxis Clarus ($CLA) Launch Plan

## Overview

This document outlines the launch plan for the Quaxis Clarus ($CLA) token on BNB Smart Chain Mainnet (Chain ID: 56).

## Token Specifications

- **Name:** Quaxis Clarus
- **Symbol:** CLA
- **Decimals:** 18 (standard)
- **Total Supply:** 100,000,000 CLA
- **Standard:** ERC20 + ERC20Permit (EIP-2612)
- **Network:** BNB Smart Chain Mainnet
- **Chain ID:** 56

## Pre-Launch Checklist

### 1. Environment Setup

- [ ] Set up `.env` file with private key
- [ ] Configure INITIAL_OWNER address: `0xdFC2382E2fA0B819B745EeABc859EC7A8e4a1fb1`
- [ ] Obtain BscScan API key for verification
- [ ] Ensure sufficient BNB for deployment gas fees (~0.01-0.02 BNB)

### 2. Smart Contract Preparation

- [ ] Compile contracts: `npm run build`
- [ ] Run test suite: `npm test`
- [ ] Review contract code and parameters
- [ ] Verify OpenZeppelin v5.x dependencies

### 3. Deployment to Mainnet

- [ ] Deploy token contract: `npm run deploy:mainnet`
- [ ] Record deployed contract address
- [ ] Verify token was minted to INITIAL_OWNER
- [ ] Check total supply on BscScan

### 4. Contract Verification

- [ ] Verify on BscScan: `npm run verify:mainnet <address>`
- [ ] Confirm verification success on BscScan
- [ ] Review public contract interface

### 5. Vesting Setup (Optional)

- [ ] Deploy BatchVestingFactory if needed
- [ ] Configure vesting schedules per parameters.example.json
- [ ] Approve factory to spend tokens
- [ ] Create vesting contracts
- [ ] Verify vesting contract deployments

### 6. Website Update

- [ ] Update `site/index.html` with contract address
- [ ] Replace placeholder logo with actual token logo
- [ ] Test website locally
- [ ] Push to GitHub to trigger Pages deployment
- [ ] Verify GitHub Pages is live

## Deployment Commands

### Mainnet Deployment

```bash
# 1. Ensure .env is configured
cp .env.example .env
# Edit .env with your PRIVATE_KEY and verify INITIAL_OWNER

# 2. Deploy token
npm run deploy:mainnet

# 3. Verify on BscScan (replace with actual address)
npm run verify:mainnet <CONTRACT_ADDRESS>

# 4. Deploy vesting factory if needed
npm run vesting:deploy <TOKEN_ADDRESS>
```

### Testnet Deployment (for testing)

```bash
# Deploy to BSC Testnet first
npm run deploy:testnet
npm run verify:testnet <CONTRACT_ADDRESS>
```

## Post-Launch Activities

### Immediate (Day 1)

- [ ] Announce contract address on official channels
- [ ] Update all documentation with contract address
- [ ] Monitor initial transactions
- [ ] Ensure liquidity setup if applicable

### Week 1

- [ ] Monitor contract activity and gas costs
- [ ] Update CoinGecko/CoinMarketCap listings
- [ ] Engage with community
- [ ] Monitor for any issues

### Month 1

- [ ] Review vesting schedules and releases
- [ ] Publish transparency reports
- [ ] Community updates
- [ ] Technical support and documentation updates

## Security Considerations

1. **Private Key Management**
   - Never commit `.env` file
   - Use hardware wallet for mainnet deployment
   - Backup private keys securely

2. **Contract Verification**
   - Always verify contracts on BscScan
   - Ensure source code matches deployment
   - Review all constructor parameters

3. **Initial Owner Address**
   - Double-check INITIAL_OWNER address
   - Confirm control of the address
   - Plan for multi-sig if needed

4. **Vesting Contracts**
   - Verify all beneficiary addresses
   - Confirm vesting schedules
   - Test on testnet first

## Support and Resources

- **Repository:** https://github.com/Bi0Dim/Token
- **BscScan:** https://bscscan.com
- **BNB Smart Chain:** https://www.bnbchain.org
- **OpenZeppelin:** https://docs.openzeppelin.com

## Emergency Procedures

In case of issues:

1. Do not panic - assess the situation
2. Check BscScan for transaction details
3. Review contract events and logs
4. Contact technical support if needed
5. Keep community informed

## Notes

- All times are in UTC
- Gas prices may vary - monitor BSC gas tracker
- Keep detailed records of all transactions
- Maintain backup of all deployment artifacts
