# Webpack Truffle Box
Tutorial to create simple dapp using Truffle, webpack, html,
This project Includes contracts, migrations, tests, user interface and webpack build pipeline.

## Installation

1. Install Truffle globally.
    ```javascript
    npm install -g truffle
    ```

2. Download the box. This also takes care of installing the necessary dependencies.
    ```javascript
    truffle unbox react
    ```

3. Run the blockchain network using ganache-cli
    ```
    $ ganache-cli
    ```

4. Add Simple Storage smart contract inside contracts folder. Compile and migrate the smart contracts.
    ```javascript
    truffle compile
    truffle migrate --reset
    ```

5. Truffle can run tests written in Solidity or JavaScript against your smart contracts. Note the command varies slightly if you're in or outside of the development console.
  ```javascript
  // If inside the development console.
  test

  // If outside the development console..
  truffle test
  ```

6. Add the  Html code to set and get value of contract inside src/app.js folder. 

7. Run the webpack server for front-end hot reloading . Smart contract changes must be manually recompiled and migrated.
    ```javascript
    // Serves the front-end on http://localhost:8080
    npm run dev
    ```


## FAQ

* __How do I use this with the EthereumJS TestRPC?__

    It's as easy as modifying the config file! [Check out our documentation on adding network configurations](http://truffleframework.com/docs/advanced/configuration#networks). Depending on the port you're using, you'll also need to update lines 96 and 98 of `app/javascripts/app.js`.

* __I'm encountering this error: Error: Can't resolve '../build/contracts/Demo.json'__

  This means you haven't compiled or migrated your contracts yet. Run `truffle develop`, `compile` and `migrate` first.

  Full error:

  ```
  ERROR in ./app/main.js
  Module not found: Error: Can't resolve '../build/contracts/Demo.json' in '/Users/tim/Documents/workspace/Consensys/test3/app'
   @ ./app/main.js 11:16-59
  ```
