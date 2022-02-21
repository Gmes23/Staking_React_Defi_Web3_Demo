let Staking = artifacts.require("./Staking");
const expect = require('chai').expect;
const utils = require("./helpers/utils");

//const BN = web3.utils.toBN('123.052');
const STAKE_ADDED_EVENT = "StakeAdded"

contract("Staking.stakeEth", function(accounts) {
    const [alice, bob] = accounts;
    let stakingInstance;

    beforeEach(async () => {
        stakingInstance = await Staking.new();
    });

    it("Stake amount sent - should stake ammount sent", async () => {
        // Arrange
        const unlockAfterBlock = web3.utils.toBN("1")
        const stakeAmmount = web3.utils.toBN("99")

        // Act
        const result = await stakingInstance.stakeEth(unlockAfterBlock, {from: alice, value: stakeAmmount});

        // Assert
        const stakeEvent = result.logs.find(e => e.event == STAKE_ADDED_EVENT)
        const stakeId = stakeEvent.args.stakeId

        const stake = await stakingInstance.stakes(stakeId, {from: alice})

        expect(stake.amount.eq(stakeAmmount), "Sent amount should be equal to staking amount!").to.be.true
    })

    it("Stake 0 amount - should throw", async () => {
        // Arrange
        const unlockAfterBlock = web3.utils.toBN("1")
        const stakeAmmount = web3.utils.toBN("0")

        // Act / Assert
        await utils.shouldThrow(stakingInstance.stakeEth(unlockAfterBlock, {from: alice, value: stakeAmmount}));
    })

    it("Stake 0 block time - should throw", async () => {
        // Arrange
        const unlockAfterBlock = web3.utils.toBN("0")
        const stakeAmmount = web3.utils.toBN("99")

        // Act / Assert
        await utils.shouldThrow(stakingInstance.stakeEth(unlockAfterBlock, {from: alice, value: stakeAmmount}));
    })
})