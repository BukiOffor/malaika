require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
//require("hardhat-gas-reporter");
require("@nomicfoundation/hardhat-chai-matchers");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */

const goerli_rpc = process.env.goerli_rpc_url
const goerli_pk = process.env.goerli_pk
const api_key = process.env.etherscan_api_key
const coinmarketcap = process.env.coinmarketcap
const sepolia_pk = process.env.sepolia_pk
const sepolia_rpc = process.env.sepolia_rpc_url

module.exports = {
    solidity: {
        compilers: [
            {
                version: "0.8.17",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
            {
                version: "0.8.0",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
            {
                version: "0.8.12",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            }
        ],
    },
    defaultNetwork: "hardhat",
    networks: {
        goerli: {
            url: goerli_rpc,
            accounts: [goerli_pk],
            chainId: 5,
            blockConfirmations: 6,
        },
        hardhat: {
            forking: {
                url: goerli_rpc,
                blockNumber: 9326339,
            },
            gasLimit: 3e10, // whatever you want here
            allowUnlimitedContractSize: true
        },
        sepolia :{
            url: sepolia_rpc,
            accounts: [sepolia_pk],
            chainId: 11155111,
            blockConfirmations : 6
          },
    },
    gasReporter: {
        enabled: true,
        outputFile: "gas_report.txt",
        noColors: true,
        currency: "USD",
        coinmarketcap: coinmarketcap,
    },
    etherscan: {
        apiKey: api_key,
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        signer: {
            default: 1,
        },
        buyer: {
            default: 2,
        },
    },
}

