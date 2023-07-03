require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("hardhat-gas-reporter");
require("@nomicfoundation/hardhat-chai-matchers");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */

const goerli_rpc = process.env.goerli_rpc_url
const goerli_pk = process.env.goerli_pk
const api_key = process.env.api_key
const coinmarketcap = process.env.coinmarketcap

module.exports = {
  solidity : {
    compilers: [
      {version : "0.8.17"},
      {version : "0.8.0"},
    ]
  },
  defaultNetwork: "hardhat",
  networks : {
    goerli: {
      url:  goerli_rpc , 
      accounts: [goerli_pk,],
      chainId: 5,
      blockConfirmations : 6
    },
    
  },
  gasReporter : {
    enabled: true,
    outputFile : "gas_report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap : coinmarketcap,
  },
  etherscan : {
    apiKey : api_key,
  },
  namedAccounts : {
    deployer : {
        default:0
    },
    seller : {
      default : 1
    },
    buyer : {
      default: 2
    }
  }
};

