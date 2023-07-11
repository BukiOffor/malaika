const {ethers,deployments, network,hre} = require("hardhat")
const {networkConfig} = require("../helper-hh-config")

async function main(){
    
    // const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545") 

    // const wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",provider) 

    // const cineCrowd = await ethers.getContractAt("CineCrowd","0x7dAe75FEaA222A0153A3a0ec432624C592cb3c70",wallet)
    
    // const response = await cineCrowd.getRemainderBalance() 
    // console.log(response.toString()) 
    // const receipt = await cineCrowd.donate({value: ethers.parseEther('1')})
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
        "CrowdSourceCreated(address,address,uint)"
    )
    const hash = ethers.keccak256(eventInbyte)
    const logs = await provider.getLogs({
        address: await Contractfactory.getAddress(),
        topics: [
            '0x1bbdae750438509a344ebf8a0bf269e2dddc83b20244f7b8a9772131f260313c',
        ],
        blockHash: await contract.blockHash,
    })
    console.log(ethers.id("CrowdSourceCreated(address,address,uint)")) //converts it to utf8 then hashes the byte

    console.log(logs)


}





main().catch((error)=>{
    console.log(error)
})