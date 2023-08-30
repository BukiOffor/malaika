const { getNamedAccounts, ethers, deployments, network } = require("hardhat")
const { networkConfig } = require("../helper-hh-config")


async function create() {
    let provider,signer,factory,chainId,contract,marketplace,crowdsource
    
    provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/")
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
        address: factory.address,
        topics: [
            "0x1bbdae750438509a344ebf8a0bf269e2dddc83b20244f7b8a9772131f260313c",
        ],
        blockHash: await contract.blockHash,
    })
    marketplace = await factory.getMarketPlace() //another way to get the contract

    const contractAddress = marketplace[0]
    crowdsource = await ethers.getContractAt(
        "CrowdSource",
        contractAddress,
        signer
    )
    console.log(contractAddress)
    

}

async function main() {
    create()
    console.log("=============================================================")
    console.log("if you need to use the create function, uncomment it in main")
    console.log("=============================================================")
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/")
    const signer = new ethers.Wallet(
        "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba",
        provider
    )
    const signer2 = new ethers.Wallet(
        "0xa267530f49f8280200edf313ee7af6b827f2a8bce2897751d06a843f644967b1",
        provider
    )

    const signer3 = new ethers.Wallet(
        "0x701b615bbdfb9de65240bc28bd21bbc0d996645a3dd57e7b12bc2bdf6f192c82",
        provider
    )

    const signer4 = new ethers.Wallet(
        "0x47c99abed3324a2707c28affff1267e45918ec8c3f20b8aa892e8b065d2942dd",
        provider
    )
    

    const crowdsource = await ethers.getContractAt(
        "CrowdSource",
        "0x336988e0C0F740F9761b2FE3703aF2fC1eA09c8e",
        signer
    )
    
    //const crowdsource4 = crowdsource.connect(signer4).donate({ value: BigInt(1200) })

    //const crowdsource2 = crowdsource.connect(signer2)
    //await crowdsource2.donate({ value: ethers.utils.parseEther("1.5") })

    console.log(parseInt(await crowdsource.getRemainderBalance())/1e18)


    console.log(parseInt(await crowdsource.getLiquidityToken(signer.address)) / 1e18)
    console.log(parseInt(await crowdsource.getLiquidityToken(signer2.address)) / 1e18)
    console.log(parseInt(await crowdsource.getLiquidityToken(signer3.address)) / 1e18)
    console.log(parseInt(await crowdsource.getLiquidityToken(signer4.address)) / 1e18)

    console.log(parseInt(await crowdsource.getLiquidityToken(crowdsource.address))/1e18)


}

main().catch((error) => {
    console.log(error)
})
