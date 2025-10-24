# Quaxis Clarus ($CLA) Token

Enterprise-grade ERC20 token on BNB Smart Chain with transparent vesting capabilities.

[![CI](https://github.com/Bi0Dim/Token/actions/workflows/ci.yml/badge.svg)](https://github.com/Bi0Dim/Token/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

Quaxis Clarus ($CLA) is a production-ready ERC20 token deployed on BNB Smart Chain Mainnet (Chain ID: 56). The token features:

- **Fixed Supply:** 100,000,000 CLA tokens (18 decimals)
- **ERC20Permit (EIP-2612):** Gasless approval support
- **Linear Vesting:** Built-in vesting contracts with cliff periods
- **Batch Deployment:** Efficient multi-beneficiary vesting factory
- **Fully Verified:** OpenZeppelin v5.x battle-tested contracts

## Token Details

- **Name:** Quaxis Clarus
- **Symbol:** CLA
- **Decimals:** 18
- **Total Supply:** 100,000,000 CLA
- **Network:** BNB Smart Chain Mainnet
- **Chain ID:** 56
- **Initial Owner:** `0xdFC2382E2fA0B819B745EeABc859EC7A8e4a1fb1`

## Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm (comes with Node.js)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/Bi0Dim/Token.git
cd Token

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# - Add your PRIVATE_KEY for deployment
# - Verify INITIAL_OWNER is set correctly
```

### Build and Test

```bash
# Compile contracts
npm run build

# Run tests
npm test

# Run coverage (optional)
npm run coverage

# Format code
npm run format

# Lint Solidity
npm run lint:sol

# Check formatting
npm run lint:format
```

## Deployment

### Mainnet Deployment (BNB Smart Chain)

1. **Configure Environment**

   ```bash
   cp .env.example .env
   # Edit .env:
   # - Set PRIVATE_KEY (ensure this account has BNB for gas)
   # - Verify INITIAL_OWNER address
   # - Set BSCSCAN_API_KEY for verification
   ```

2. **Deploy Token**

   ```bash
   npm run deploy:mainnet
   ```

   This will:
   - Deploy ClarusToken contract
   - Mint 100M CLA to INITIAL_OWNER
   - Display deployment summary

3. **Verify on BscScan**

   ```bash
   npm run verify:mainnet <CONTRACT_ADDRESS>
   ```

4. **Deploy Vesting (Optional)**
   ```bash
   npm run vesting:deploy <TOKEN_ADDRESS>
   ```

### Testnet Deployment

```bash
# Deploy to BSC Testnet
npm run deploy:testnet

# Verify on Testnet
npm run verify:testnet <CONTRACT_ADDRESS>
```

## Smart Contracts

### ClarusToken.sol

Main ERC20 token contract with EIP-2612 permit functionality.

```solidity
constructor(address initialOwner)
```

- Mints 100,000,000 CLA (with 18 decimals) to `initialOwner`
- Implements ERC20 and ERC20Permit
- Fixed supply, no minting capability

### LinearVesting.sol

Linear vesting contract with cliff period support.

```solidity
constructor(
    address token,
    address beneficiary,
    uint256 start,
    uint256 cliffDuration,
    uint256 duration,
    uint256 amount
)
```

- Releases tokens linearly after cliff period
- Beneficiary can call `release()` to claim vested tokens
- Immutable parameters set at deployment

### BatchVestingFactory.sol

Factory for deploying multiple vesting contracts efficiently.

```solidity
function createVestingBatch(
    address[] beneficiaries,
    uint256[] amounts,
    uint256 start,
    uint256 cliffDuration,
    uint256 duration
) external onlyOwner returns (address[])
```

- Deploys multiple LinearVesting contracts with identical schedule
- Owner-only access
- Handles token distribution to all vesting contracts

## Development

### Project Structure

```
Token/
├── contracts/           # Solidity smart contracts
│   ├── ClarusToken.sol
│   ├── LinearVesting.sol
│   └── BatchVestingFactory.sol
├── test/               # Test files
│   ├── ClarusToken.test.ts
│   ├── LinearVesting.test.ts
│   └── BatchVestingFactory.test.ts
├── scripts/            # Deployment and utility scripts
│   ├── deploy.ts
│   ├── verify.ts
│   └── vesting.ts
├── docs/               # Documentation
│   └── launch/
│       ├── launch-plan.md
│       └── parameters.example.json
├── site/               # GitHub Pages landing
│   ├── index.html
│   ├── assets/
│   └── .nojekyll
├── .github/            # GitHub Actions workflows
│   └── workflows/
│       ├── ci.yml
│       ├── verify.yml
│       └── pages.yml
└── hardhat.config.ts   # Hardhat configuration
```

### Running Tests

```bash
# Run all tests
npm test

# Run with gas reporting
REPORT_GAS=true npm test

# Run coverage
npm run coverage
```

### Code Quality

```bash
# Format all files
npm run format

# Check formatting
npm run lint:format

# Lint Solidity files
npm run lint:sol
```

## GitHub Pages

The project includes a responsive landing page in the `site/` directory. It automatically deploys to GitHub Pages when pushing to the main branch.

### Updating the Landing Page

1. Replace placeholder logo in `site/assets/`:
   - `logo.png` - Main logo
   - `logo-512.png` - 512x512 variant
   - `logo-256.png` - 256x256 variant

2. Update contract address in `site/index.html`:

   ```javascript
   const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
   ```

3. Push to main branch - GitHub Actions will deploy automatically

### Enable GitHub Pages

1. Go to repository Settings → Pages
2. Select Source: GitHub Actions
3. The site will be available at: `https://Bi0Dim.github.io/Token/`

## CI/CD

### Continuous Integration

The repository includes GitHub Actions workflows:

- **CI (`ci.yml`)**: Runs on every push/PR
  - Installs dependencies
  - Checks code formatting
  - Lints Solidity files
  - Compiles contracts
  - Runs test suite

- **BscScan Verification (`verify.yml`)**: Runs on version tags
  - Automatically verifies contracts when creating a release tag
  - Requires `BSCSCAN_API_KEY`, `INITIAL_OWNER`, and `CONTRACT_ADDRESS` secrets

- **GitHub Pages (`pages.yml`)**: Deploys landing page
  - Automatically deploys `site/` to GitHub Pages on main branch

### Setting Up Secrets

For automated verification, add these secrets in repository settings:

1. Go to Settings → Secrets and variables → Actions
2. Add:
   - `BSCSCAN_API_KEY`: Your BscScan API key
   - `INITIAL_OWNER`: Initial owner address
   - `CONTRACT_ADDRESS`: Deployed token address

## Documentation

- [Launch Plan](docs/launch/launch-plan.md) - Detailed deployment guide
- [Parameters Example](docs/launch/parameters.example.json) - Vesting configuration examples
- [OpenZeppelin v5 Docs](https://docs.openzeppelin.com/contracts/5.x/) - Base contract documentation

## Security

- Built with OpenZeppelin v5.x audited contracts
- Fixed supply - no minting capability
- Immutable vesting parameters
- All contracts verified on BscScan

### Audit Status

The contracts use OpenZeppelin's audited implementations. For production use, consider:

- Independent security audit
- Formal verification
- Bug bounty program

## License

MIT License - see [LICENSE](LICENSE) file for details

## Support

- **Issues:** [GitHub Issues](https://github.com/Bi0Dim/Token/issues)
- **Discussions:** [GitHub Discussions](https://github.com/Bi0Dim/Token/discussions)
- **Website:** [GitHub Pages](https://Bi0Dim.github.io/Token/)

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Acknowledgments

- Built with [Hardhat](https://hardhat.org/)
- Powered by [OpenZeppelin](https://openzeppelin.com/)
- Deployed on [BNB Smart Chain](https://www.bnbchain.org/)

---

**⚠️ Important:** Always test on BSC Testnet before deploying to Mainnet. Never commit private keys or `.env` files to version control.
