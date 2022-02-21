export const STAKING_UTILS = [

    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_unlockAfterBlocks",
                "type": "uint256"
            }
        ],
        "name": "stakeEth",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256[]",
                "name": "withdrawIds",
                "type": "uint256[]"
            }
        ],
        "name": "withdrawEth",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]