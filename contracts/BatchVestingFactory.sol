// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./LinearVesting.sol";

/**
 * @title BatchVestingFactory
 * @dev Factory contract to deploy multiple LinearVesting contracts with identical schedule
 * Only owner can create vesting contracts
 */
contract BatchVestingFactory is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable token;
    
    event VestingCreated(
        address indexed vestingContract,
        address indexed beneficiary,
        uint256 amount
    );

    /**
     * @dev Constructor
     * @param _token Address of the ERC20 token
     * @param _owner Address of the contract owner
     */
    constructor(address _token, address _owner) Ownable(_owner) {
        require(_token != address(0), "BatchVestingFactory: token is zero address");
        token = IERC20(_token);
    }

    /**
     * @dev Creates multiple vesting contracts with identical schedule
     * @param beneficiaries Array of beneficiary addresses
     * @param amounts Array of token amounts for each beneficiary
     * @param start Start timestamp of vesting
     * @param cliffDuration Duration of cliff period in seconds
     * @param duration Total vesting duration in seconds
     * @return vestingContracts Array of created vesting contract addresses
     */
    function createVestingBatch(
        address[] calldata beneficiaries,
        uint256[] calldata amounts,
        uint256 start,
        uint256 cliffDuration,
        uint256 duration
    ) external onlyOwner returns (address[] memory vestingContracts) {
        require(
            beneficiaries.length == amounts.length,
            "BatchVestingFactory: length mismatch"
        );
        require(beneficiaries.length > 0, "BatchVestingFactory: empty arrays");

        vestingContracts = new address[](beneficiaries.length);
        uint256 totalAmount = 0;

        for (uint256 i = 0; i < beneficiaries.length; i++) {
            LinearVesting vesting = new LinearVesting(
                address(token),
                beneficiaries[i],
                start,
                cliffDuration,
                duration,
                amounts[i]
            );

            vestingContracts[i] = address(vesting);
            totalAmount += amounts[i];

            emit VestingCreated(address(vesting), beneficiaries[i], amounts[i]);
        }

        // Transfer total amount of tokens to all vesting contracts
        token.safeTransferFrom(msg.sender, address(this), totalAmount);
        
        for (uint256 i = 0; i < vestingContracts.length; i++) {
            token.safeTransfer(vestingContracts[i], amounts[i]);
        }

        return vestingContracts;
    }

    /**
     * @dev Creates a single vesting contract
     * @param beneficiary Address of the beneficiary
     * @param amount Amount of tokens to vest
     * @param start Start timestamp of vesting
     * @param cliffDuration Duration of cliff period in seconds
     * @param duration Total vesting duration in seconds
     * @return vestingContract Address of created vesting contract
     */
    function createVesting(
        address beneficiary,
        uint256 amount,
        uint256 start,
        uint256 cliffDuration,
        uint256 duration
    ) external onlyOwner returns (address vestingContract) {
        LinearVesting vesting = new LinearVesting(
            address(token),
            beneficiary,
            start,
            cliffDuration,
            duration,
            amount
        );

        vestingContract = address(vesting);

        // Transfer tokens to vesting contract
        token.safeTransferFrom(msg.sender, vestingContract, amount);

        emit VestingCreated(vestingContract, beneficiary, amount);
        return vestingContract;
    }
}
