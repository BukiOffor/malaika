const { getNamedAccounts, ethers, deployments, network } = require("hardhat")
const { networkConfig } = require("../helper-hh-config")


async function main(){
    
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545") 

    const wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",provider) 

    const factory = await ethers.getContractAt(
        "Factory",
        "0xd3924Aed3dbE4bdBC12FBc5917bBa7202141FE6F",
        wallet
    )
    const contract = await factory.CreateCrowdSource(
        "1000",
        "50",
        networkConfig[network.config.chainId].priceFeed,
        wallet.getAddress()
    )
    contract.wait(3)
    const blockNumber = contract.blockNumber
    const eventInbyte = ethers.toUtf8Bytes(
        "CrowdSourceCreated(address,address,uint)"
    )
    const hash = ethers.keccak256(eventInbyte)
    const logs = await provider.getLogs({
        address: await factory.getAddress(),
        topics: [],
        //fromBlock:  ethers.toBeHex(9326340),
        //toBlock: ethers.toBeHex(9326342),
        blockHash:contract.blockHash
    })

    //console.log(logs)




    
}

main().catch((error) => {
    console.log(error)
})