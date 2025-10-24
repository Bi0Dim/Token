// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title LinearVesting
 * @dev Linear vesting contract with cliff period
 * Tokens are released linearly after cliff period ends
 */
contract LinearVesting {
    using SafeERC20 for IERC20;

    IERC20 public immutable token;
    address public immutable beneficiary;
    uint256 public immutable start;
    uint256 public immutable cliff;
    uint256 public immutable duration;
    uint256 public immutable totalAmount;
    uint256 public released;

    event TokensReleased(uint256 amount);

    /**
     * @dev Constructor
     * @param _token Address of the ERC20 token
     * @param _beneficiary Address that receives vested tokens
     * @param _start Start timestamp of vesting
     * @param _cliffDuration Duration of cliff period in seconds
     * @param _duration Total vesting duration in seconds (from start)
     * @param _amount Total amount of tokens to vest
     */
    constructor(
        address _token,
        address _beneficiary,
        uint256 _start,
        uint256 _cliffDuration,
        uint256 _duration,
        uint256 _amount
    ) {
        require(_token != address(0), "LinearVesting: token is zero address");
        require(_beneficiary != address(0), "LinearVesting: beneficiary is zero address");
        require(_duration > 0, "LinearVesting: duration is 0");
        require(_amount > 0, "LinearVesting: amount is 0");
        require(_duration >= _cliffDuration, "LinearVesting: cliff longer than duration");

        token = IERC20(_token);
        beneficiary = _beneficiary;
        start = _start;
        cliff = _start + _cliffDuration;
        duration = _duration;
        totalAmount = _amount;
    }

    /**
     * @dev Releases vested tokens to beneficiary
     * @return amount Amount of tokens released
     */
    function release() external returns (uint256) {
        uint256 releasable = _releasableAmount();
        require(releasable > 0, "LinearVesting: no tokens to release");

        released += releasable;
        token.safeTransfer(beneficiary, releasable);

        emit TokensReleased(releasable);
        return releasable;
    }

    /**
     * @dev Calculates the amount of tokens that have already vested
     * @return Amount of tokens vested
     */
    function vestedAmount() public view returns (uint256) {
        if (block.timestamp < cliff) {
            return 0;
        } else if (block.timestamp >= start + duration) {
            return totalAmount;
        } else {
            return (totalAmount * (block.timestamp - start)) / duration;
        }
    }

    /**
     * @dev Calculates the amount of tokens that can be released
     * @return Amount of tokens that can be released
     */
    function _releasableAmount() private view returns (uint256) {
        return vestedAmount() - released;
    }

    /**
     * @dev Returns the amount of tokens that can be released
     * @return Amount of tokens that can be released
     */
    function releasableAmount() external view returns (uint256) {
        return _releasableAmount();
    }
}
