let Staking = artifacts.require("./Staking");
const expect = require('chai').expect;
const utils = require("./helpers/utils");

//const BN = web3.utils.toBN('123.052');
const STAKE_ADDED_EVENT = "StakeAdded"
const STAKE_WHITDRAWN_EVENT = "StakeWithdrawn"
const STAKE_TRANSFER_EVENT = "Transfer"

function tokenMintCount(unlockAfterBlock, stakeAmmount) {
    return unlockAfterBlock.mul(stakeAmmount)
}

contract("Staking.withdrawEth", function(accounts) {
    const [alice, bob] = accounts;
    let stakingInstance;

    beforeEach(async () => {
        stakingInstance = await Staking.new();
    });

    it("Stake once - should withdraw", async () => {
        // Arrange
        const unlockAfterBlock = web3.utils.toBN("1")
        const stakeAmmount = web3.utils.toBN("99")

        const stakeResult = await stakingInstance.stakeEth(unlockAfterBlock, {from: alice, value: stakeAmmount});
        const stakeEvent = stakeResult.logs.find(e => e.event == STAKE_ADDED_EVENT)
        const stakeId = stakeEvent.args.stakeId
        const startBlockNumber = stakeResult.receipt.blockNumber
        // Assert

        const withdrawResult = await stakingInstance.withdrawEth([stakeId.toString()], {from: alice})
        const transferEvent = withdrawResult.logs.find(e => e.event == STAKE_TRANSFER_EVENT)
        const withdrawAmount = transferEvent.args.value
        const withdrawTo = transferEvent.args.to

        expect(withdrawAmount.eq(stakeAmmount), "Sent amount is not equal to withdraw amount!").to.be.true
        expect(withdrawTo, "Should send to alice address!").to.be.equal(alice)

        const stakeAfterWithdraw = await stakingInstance.stakes(stakeId, {from: alice})
        expect(stakeAfterWithdraw.isWithdrawn, "Stake isWithdrawn is set to true!").to.be.true

        const rwrdBalance = await stakingInstance.balanceOf(alice)
        expect(rwrdBalance.eq(tokenMintCount(unlockAfterBlock, stakeAmmount)), "Balance od RWRD should be of the minted size!").to.be.true
    })

    it("Stake twice and withdraw both - should withdraw both", async () => {
        // Arrange
        const unlockAfterBlock = web3.utils.toBN("1")
        const stakeAmmount1 = web3.utils.toBN("99")
        const stakeAmmount2 = web3.utils.toBN("50")

        const stakeResult1 = await stakingInstance.stakeEth(unlockAfterBlock, {from: alice, value: stakeAmmount1});
        const stakeEvent1 = stakeResult1.logs.find(e => e.event == STAKE_ADDED_EVENT)
        const stakeId1 = stakeEvent1.args.stakeId

        const stakeResult2 = await stakingInstance.stakeEth(unlockAfterBlock, {from: alice, value: stakeAmmount2});
        const stakeEvent2 = stakeResult2.logs.find(e => e.event == STAKE_ADDED_EVENT)
        const stakeId2 = stakeEvent2.args.stakeId
        // Assert

        const withdrawResult = await stakingInstance.withdrawEth([stakeId1.toString(), stakeId2.toString()], {from: alice})
        const transferEvent = withdrawResult.logs.find(e => e.event == STAKE_TRANSFER_EVENT)
        const withdrawAmount = transferEvent.args.value
        const withdrawTo = transferEvent.args.to

        expect(withdrawAmount.eq(stakeAmmount1.add(stakeAmmount2)), "Sent amount from both stakes should equal to withdraw amount!").to.be.true
        expect(withdrawTo, "Should send to alice address!").to.be.equal(alice)

        const stake1AfterWithdraw = await stakingInstance.stakes(stakeId1, {from: alice})
        expect(stake1AfterWithdraw.isWithdrawn, "Stake 1 isWithdrawn should be true!").to.be.true

        const stake2AfterWithdraw = await stakingInstance.stakes(stakeId2, {from: alice})
        expect(stake2AfterWithdraw.isWithdrawn, "Stake isWithdrawn should be true!").to.be.true

        const rwrdBalance = await stakingInstance.balanceOf(alice)
        expect(rwrdBalance.eq(tokenMintCount(unlockAfterBlock, stakeAmmount1).add(tokenMintCount(unlockAfterBlock, stakeAmmount2))), 
            "Balance od RWRD should be of the minted size!").to.be.true
    })

    it("Stake twice and withdraw first - should withdraw only first", async () => {
        // Arrange
        const unlockAfterBlock = web3.utils.toBN("1")
        const stakeAmmount1 = web3.utils.toBN("99")
        const stakeAmmount2 = web3.utils.toBN("50")

        const stakeResult1 = await stakingInstance.stakeEth(unlockAfterBlock, {from: alice, value: stakeAmmount1});
        const stakeEvent1 = stakeResult1.logs.find(e => e.event == STAKE_ADDED_EVENT)
        const stakeId1 = stakeEvent1.args.stakeId

        const stakeResult2 = await stakingInstance.stakeEth(unlockAfterBlock, {from: alice, value: stakeAmmount2});
        const stakeEvent2 = stakeResult2.logs.find(e => e.event == STAKE_ADDED_EVENT)
        const stakeId2 = stakeEvent2.args.stakeId
        // Assert

        const withdrawResult = await stakingInstance.withdrawEth([stakeId1.toString()], {from: alice})
        const transferEvent = withdrawResult.logs.find(e => e.event == STAKE_TRANSFER_EVENT)
        const withdrawAmount = transferEvent.args.value
        const withdrawTo = transferEvent.args.to

        expect(withdrawAmount.eq(stakeAmmount1), "Sent amount from first stake should equal to withdraw amount!").to.be.true
        expect(withdrawTo, "Should send to alice address!").to.be.equal(alice)

        const stake1AfterWithdraw = await stakingInstance.stakes(stakeId1, {from: alice})
        expect(stake1AfterWithdraw.isWithdrawn, "Stake 1 isWithdrawn should be true!").to.be.true

        const stake2AfterWithdraw = await stakingInstance.stakes(stakeId2, {from: alice})
        expect(stake2AfterWithdraw.isWithdrawn, "Stake 2 isWithdrawn should be false!").to.be.false

        const rwrdBalance = await stakingInstance.balanceOf(alice)
        expect(rwrdBalance.eq(tokenMintCount(unlockAfterBlock, stakeAmmount1)), "Balance od RWRD should be of the minted size!").to.be.true
    })

    it("Withdraw 0 ids - should throw", async () => {
        // Act / Assert
        await utils.shouldThrow(stakingInstance.withdrawEth([], {from: alice}))
    })

    it("Withdraw invalid id - should throw", async () => {
        // Arrange
        const unlockAfterBlock = web3.utils.toBN("1")
        const stakeAmmount = web3.utils.toBN("99")

        const stakeResult = await stakingInstance.stakeEth(unlockAfterBlock, {from: alice, value: stakeAmmount});

        // Act / Assert
        const invalidId = web3.utils.toBN("99999999999999")
        await utils.shouldThrow(stakingInstance.withdrawEth([invalidId], {from: alice}))
    })

    it("Withdraw not owned id - should throw", async () => {
        // Arrange
        const unlockAfterBlock = web3.utils.toBN("1")
        const stakeAmmount = web3.utils.toBN("99")

        const stakeResult = await stakingInstance.stakeEth(unlockAfterBlock, {from: alice, value: stakeAmmount});
        const stakeEvent = stakeResult.logs.find(e => e.event == STAKE_ADDED_EVENT)
        const stakeId = stakeEvent.args.stakeId

        // Act / Assert
        await utils.shouldThrow(stakingInstance.withdrawEth([stakeId], {from: bob}))
    })

    it("Withdraw before staking ends - should throw", async () => {
        // Arrange
        const unlockAfterBlock = web3.utils.toBN("999999999")
        const stakeAmmount = web3.utils.toBN("99")

        const stakeResult = await stakingInstance.stakeEth(unlockAfterBlock, {from: alice, value: stakeAmmount});
        const stakeEvent = stakeResult.logs.find(e => e.event == STAKE_ADDED_EVENT)
        const stakeId = stakeEvent.args.stakeId

        // Act / Assert
        await utils.shouldThrow(stakingInstance.withdrawEth([stakeId], {from: alice}))
    })
})