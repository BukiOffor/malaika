const {ethers,deployments, network,hre} = require("hardhat")
const {networkConfig} = require("../helper-hh-config")

async function main(){
    
    const [deployer] = await ethers.getSigners()
    await deployments.fixture()
    const Contractfactory = await ethers.getContract("Factory",deployer)
    const contract = await Contractfactory.CreateCrowdSource(
        "1000",
        "50",
        networkConfig[network.config.chainId].priceFeed,
        deployer.getAddress()
    )
    contract.wait(3)
    const blockNumber = contract.blockNumber
    const provider = await contract.provider
    const eventInbyte = ethers.toUtf8Bytes(
        "CrowdSourceCreated(address,address,uint256)"
    )
    const hash = ethers.keccak256(eventInbyte)
    const logs = await provider.getLogs({
        address: await Contractfactory.getAddress(),
        topics: [
            "0x1bbdae750438509a344ebf8a0bf269e2dddc83b20244f7b8a9772131f260313c",
        ],
        blockHash: await contract.blockHash,
        //fromBlock:  ethers.toBeHex(9326340),
        //toBlock: ethers.toBeHex(9326342),
    })
    console.log(ethers.id("CrowdSourceCreated(address,address,uint256)")) //converts it to utf8 then hashes the byte

    const byteCode = await provider.getCode(deployer.getAddress())

    console.log(byteCode)


}





main().catch((error)=>{
    console.log(error)
})