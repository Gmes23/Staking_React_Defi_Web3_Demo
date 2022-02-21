# Super Staking App

A staking application running on the rinkeby test server.
User connect his wallet to Interface.
User inputs the amount of ETH he would like to lock
User inputs the number of blocks for which he would like to lock the ETH for.
User clicks a Confirm button and validates the transaction
The ETH are sent from the User’s wallet to the smart-contract
The User’s ETH is locked in the Smart-contract for the defined number of blocks
After the number of blocks is passed, the User’s can withdraw their 

## Testnet

This app is run on **Rinkbey testnet** using **metamask**.
Contract can be found on address: [0x4c83a3fd89dab9abc40b2fd59c32edc4fc8dac4f](https://rinkeby.etherscan.io/address/0x4c83a3fd89dab9abc40b2fd59c32edc4fc8dac4f)

## Runing

### Prerequisites

* [Yarn](https://classic.yarnpkg.com/en/docs/install)
* [Node](https://nodejs.org/en/download/)

* Eth Wallet and Rinkey Ethereum which can be claimed for free.

    
    Install metamask
    
    Create new Ethereum address
    
    On the Metamask icon on the top you should be able to choose the network you want to work on. 
    Choose the Rinkbey Network (This is the ethereum test network)

    Now get some free test ethereum by heading over to (https://faucet.rinkeby.io/)

    Where you will be prompted to share a social media post to claim your free ethereum, 
    making a twitter account is the easiest and fastest method.

    Once you make your tweet which an exmaple can be found in the link in the bottom page with the twitter icon, post your link on the search box.

    Some free ethereum test coins should arrive shortly!
    

### Run Solidity tests

Go to `./solidity`

Install [Truffle Suite](https://www.trufflesuite.com/docs/truffle/overview) globally with `npm install -g truffle`
Run `yarn install`

Run `truffle test` to run tests.

## Installation

1. Install Truffle globally.
    ```javascript
    npm install -g truffle
    ```

2. Download npm packages for the front end by going to the my=-app folder and installing the necessary dependencies, then use npm start to start the dev env on your browser.

    ```javascript
    npm install
    npm start 
    ```

3. Run the development console.
    ```javascript
    truffle develop
    ```

4. Compile and migrate the smart contracts. Note inside the development console we don't preface commands with `truffle`.
    ```javascript
    compile
    migrate
    ```

5. Run the webpack server for front-end hot reloading (outside the development console). Smart contract changes must be manually recompiled and migrated.
    ```javascript
    // Change directory to the front-end folder
    cd client
    // Serves the front-end on http://localhost:3000
    npm run start
    ```

6. Truffle can run tests written in Solidity or JavaScript against your smart contracts. Note the command varies slightly if you're in or outside of the development console.
    ```javascript
    // If inside the development console.
    test

    // If outside the development console..
    truffle test
    ```

7. Jest is included for testing React components. Compile your contracts before running Jest, or you may receive some file not found errors.
    ```javascript
    // Make sure you are inside the client folder
    cd client
    // Run Jest outside of the development console for front-end component tests.
    npm run test
    ```

8. To build the application for production, use the build command. A production build will be in the build_webpack folder.
    ```javascript
    // Make sure you are inside the client folder
    cd client
    // Run the build script
    npm run build
    ```
