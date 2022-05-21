# Multi sig wallet dapp starter

This project is built to serve as a starter for a multi sig wallet
descentralized application.

It includes the wallet contract, scripts to run and deploy local or on testnets and a basic front-end app that connects to the contract.

The stack used `Solidity`, `Typescript`, `Hardhat`, `EthersJS`, `React` (create-react-app), `TailwindCSS`

## Local development

Clone the project locally and `cd` in the created directory


#### Install dependencies
```
npm install
```

#### Start local development blockchain
```
npx hardhat node

```

#### Deploy contract locally
In another teminal window
```
npm run localDeploy
```
Contract is deployed by the first account created by Hardhat and with 3 signers
- the first three accounts created by Hardhat. Connect one of these accounts to
  your Metamask wallet to test it in front-end.


#### Deploy contract on testnets

Create a `.env` file based on the 'env.example' and provide the netwrok url
(usually provided by INFURA or other provider) and 3 private keys for the
wallets whcih will be used as signers when contract is deployed.

```
npm run deploy -- --<network>
```
(Ex: `npm run deploy -- --rinkeby`)
Requires provision of the owner and signer addresses for the target network.
Only tested on `rinkeby` but also set up to support `mumbai`.

#### Run tests
```
npm run test
```

### Frontend development

#### Install dependencies and setup
```
cd frontend
npm install
```

Create a `.env` file based on the provided example (`env.example`) and set `REACT_APP_ENVIRONMENT` value to `"local"` to connect to local chain or `<testnet>` if you have the contract deployed to one of the networks. (currently supported by the scripts `rinkeby` and `mumbai`)
Also currently requires an INFURA project to connect to testnets and wallet.


#### Start development server
```
npm start
```
Open `http://localhost:3000` in browser


#### Build frontend
```
npm run build
```

#### Run tests in frontend
```
npm test
```

### Other Hardhat commands

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.ts
TS_NODE_FILES=true npx ts-node scripts/deploy.ts
npx eslint '**/*.{js,ts}'
npx eslint '**/*.{js,ts}' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```

# Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Hello, Hardhat!"
```

# Performance optimizations

For faster runs of your tests and scripts, consider skipping ts-node's type checking by setting the environment variable `TS_NODE_TRANSPILE_ONLY` to `1` in hardhat's environment. For more details see [the documentation](https://hardhat.org/guides/typescript.html#performance-optimizations).
