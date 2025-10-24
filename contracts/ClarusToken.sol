// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/**
 * @title ClarusToken
 * @dev Quaxis Clarus ($CLA) Token - ERC20 with ERC20Permit
 * Fixed supply of 100,000,000 CLA tokens (18 decimals)
 * All tokens minted to initial owner on deployment
 */
contract ClarusToken is ERC20, ERC20Permit {
    uint256 private constant TOTAL_SUPPLY = 100_000_000; // 100 million tokens

    /**
     * @dev Constructor mints entire supply to initialOwner
     * @param initialOwner Address that receives the entire initial supply
     */
    constructor(address initialOwner) ERC20("Quaxis Clarus", "CLA") ERC20Permit("Quaxis Clarus") {
        require(initialOwner != address(0), "ClarusToken: initial owner is zero address");
        _mint(initialOwner, TOTAL_SUPPLY * 10 ** decimals());
    }
}
