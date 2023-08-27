const networkConfig = {
    5: {
        name: "goerli",
        priceFeed : "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
        minAmount : "100",
        amountNeeded : "50000" 
    },
    31337: {
        name: "hardhat",
        minAmount : "100",
        amountNeeded : "50000",
        priceFeed : "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    }
}
const frontEndContractsFile = "../"
const frontEndAbiFile = "/Users/mac/crowda-new/src/constants/"
const developmentChains = ["hardhat",'localhost']

module.exports = {
    developmentChains,
    frontEndContractsFile,
    frontEndAbiFile,
    networkConfig
}