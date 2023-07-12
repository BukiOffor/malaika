const { getNamedAccounts, ethers, deployments, network } = require("hardhat")
const { networkConfig } = require("../helper-hh-config")


async function create() {
    let provider,signer,factory,chainId,contract,marketplace,crowdsource
    
    provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/")
    signer = new ethers.Wallet(
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        provider
    )

    factory = await ethers.getContractAt(
        "Factory",
        "0xd3924Aed3dbE4bdBC12FBc5917bBa7202141FE6F",
        signer
    )
    chainId = network.config.chainId
    contract = await factory.CreateCrowdSource(
        "10000",
        "500",
        networkConfig[chainId].priceFeed,
        signer.getAddress()
    )
    const logs = await provider.getLogs({
        address: await factory.getAddress(),
        topics: [
            "0x1bbdae750438509a344ebf8a0bf269e2dddc83b20244f7b8a9772131f260313c",
        ],
        blockHash: await contract.blockHash,
    })
    const contractAddress = ethers.stripZerosLeft(logs[0].topics[1])
    marketplace = await factory.getMarketPlace() //another way to get the contract
    crowdsource = await ethers.getContractAt(
        "CrowdSource",
        contractAddress,
        signer
    )
    console.log(contractAddress)
    

}

async function main() {
    //create()
    console.log("=============================================================")
    console.log("if you need to use the create function, uncomment it in main")
    console.log("=============================================================")
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/")
    const signer = new ethers.Wallet(
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        provider
    )
    const withdrawn = await provider.getStorage("0x336988e0C0F740F9761b2FE3703aF2fC1eA09c8e", 0x04)
    console.log(withdrawn)

}

main().catch((error) => {
    console.log(error)
})
