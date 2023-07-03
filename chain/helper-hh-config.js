const networkConfig = {
    5: {
        name: "goerli",
        priceFeed : "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
        minAmount : "100",
        amountNeeded : "5000000000000" 
    },
    31337: {
        name: "hardhat",
        minAmount : "100",
        amountNeeded : "5000000000000" 
    }
}

const frontEndContractsFile = "../client/constants/contractAddresses.json"
const frontEndAbiFile = "../client/constants/abi.json"
const developmentChains = ["hardhat",'localhost']

module.exports = {
    developmentChains,
    frontEndContractsFile,
    frontEndAbiFile,
    networkConfig
}