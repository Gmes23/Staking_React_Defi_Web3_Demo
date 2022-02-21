// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface StakingInterface {
    function stakeEth(uint _unlockAfterBlocks) external payable;
    function withdrawEth(uint[] memory withdrawIds) external;
}

contract Staking is StakingInterface, ERC20 {
    event StakeAdded(address indexed owner, uint stakeId);

    uint MAX_INT = 2**256 - 1;

    struct Stake {
        uint amount;
        uint stakedAtBlock;
        uint unlockAtBlock;
        address owner;
        bool isWithdrawn;
    }

    Stake[] public stakes;

    constructor () ERC20("RewardsToken", "RWRD") {}

    function stakeEth(uint _unlockAfterBlocks) external payable override {
        require(msg.value > 0, "Stake amount has to be more than 0");
        require(_unlockAfterBlocks > 0, "You must stake for at least the period of 1 block");

        uint unlockAtBlock = block.number + _unlockAfterBlocks;

        stakes.push(Stake(msg.value, block.number, unlockAtBlock, msg.sender, false));

        emit StakeAdded(msg.sender, stakes.length - 1);
    }

    function withdrawEth(uint[] memory _withdrawIds) external override {
        require(_withdrawIds.length > 0, "You must provide at least one withdraw id");

        uint ownerWithdrawAmount = 0;
        uint rewardTokenCount = 0;

        for (uint i = 0; i < _withdrawIds.length; i++) {
            uint id = _withdrawIds[i];
            require(id < stakes.length, "Stake with id does not exist!");
            // check if owner, stake has not been withdrawn yet and if stake time has passed
            if (stakes[id].owner == msg.sender && !stakes[id].isWithdrawn && stakes[id].unlockAtBlock <= block.number) {
                ownerWithdrawAmount += stakes[id].amount;
                stakes[id].isWithdrawn = true;
                rewardTokenCount += _getRewardTokenCount(stakes[id].stakedAtBlock, stakes[id].unlockAtBlock, stakes[id].amount);
            } else {
                revert("You cannot withdraw these stakes!");
            }
        }

        assert(ownerWithdrawAmount > 0);
        assert(ownerWithdrawAmount <= address(this).balance);

        _mint(msg.sender, rewardTokenCount);

        address payable stakeOwner = payable(msg.sender);
        stakeOwner.transfer(ownerWithdrawAmount);
    }

    function _getRewardTokenCount(uint _stakedAtBlock, uint _unlockAtBlock, uint _amountStaked) private pure returns(uint) {
        uint timeStaked = _unlockAtBlock - _stakedAtBlock;
        return timeStaked * _amountStaked;
    }
}