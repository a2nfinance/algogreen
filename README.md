## Overview
Algogreen offers features that enable DAOs to manage loans, allowing individuals and organizations easy and transparent access to loans for project development. Additionally, it tokenizes Real World Assets (carbon offset credits) using the Algorand platform, enabling the trading of carbon credits to help people raise capital, expand production, and repay their loans.

Algogreen can be seen as the beginning of combining ideas from DAOs, DeFi, along with Real World Assets and a fractionalized NFT marketplace.

Admin app: [admin-algogreen](https://admin-algogreen.a2n.finance)

Marketplace app: [marketplace-algogreen](https://marketplace-algogreen.a2n.finance)

DeFi app: [defi-algogreen](https://defi-algogreen.a2n.finance)

## System architecture

For more details of Algogreen, you can read [this document](HKT.md)

## Prerequisites

To understand source code, you should have basic knowlege of:
- NodeJS
- React
- Next JS
- Cloud Mongo database.
- Python
- Algorand application development
- Algokit. 
- Algosdk for Python & Javascript.
- TxLab Wallet Connect
- Linux & docker commands.

## Installation steps
**Step 1: Install Dev environment**

- Install NodeJS (16+)
- Install Docker
- Install Python (3.17+)
- Install Algokit
- Install VisualCode studio.
- Create a new collection on Mongo Cloud Database.

Copy your database access URL to each .env file.

**Step 2: Install webapp libraries**
- Go to each folder
    - ```cd webapp ``` -> ```npm i```
    - ```cd admin ``` -> ```npm i```
    - ```cd carbon-credit-mkp ``` -> ```npm i```

**Step 3: Compile smart contracts**
- To compile smart contracts:
    - ```cd contracts/marketplace_contract``` ->  ```python compile```
    - ```cd contracts/dao_contracts``` ->  ```python compile```

**Step 4: Copy all generated .teal & .json files**

Copy artifacts from contracts folder to webapp, admin, and carbon-credit-mkp folders.


## Commands to start

- To run webapp in Dev mode, use this command: ```npm run dev```. 
- To run webapp in Production mdoe, use this command: ```pm2 run npm --name "your app name" -- run start```

## Test smart contracts

- You have to install Algokit and Docker to run localnet, using this command: ```algokit run localnet```
- Go to each smart contract folder: ```python dao_demo.py``` or ```python marketplace_demo.py```

## Contribution
We welcome any ideas or suggestions to help us make Algogreen better. Please do not hesitate to contact us via email at john@a2n.finance.

## License

This package is released under the BSL 1.1 License.

