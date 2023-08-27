const {ethers,deployments, network,hre} = require("hardhat")
const {networkConfig} = require("../helper-hh-config")

async function main(){
    

    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/")
    const wallet = new ethers.Wallet("0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6", provider)
    const signer = new ethers.Wallet('0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0',provider )
    const deployer = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",provider )

    // const response = await wallet.sendTransaction({
    //     to: "0xa436585577918a038DF63116216331258b19017d",
    //     value: ethers.utils.parseEther("9000")
    // })

    //  const crowdsource = await ethers.getContractAt("CrowdSource", "0x336988e0c0f740f9761b2fe3703af2fc1ea09c8e",signer)
    //  const response = await crowdsource.revertDonations()
    // console.log(response)

    // const crowdsource = await ethers.getContractAt("CrowdSource", "0xa436585577918a038DF63116216331258b19017d",wallet)
    // const response = await crowdsource.donate({value:ethers.utils.parseEther('1')})
    // console.log(response)

    // const crowdsource = await ethers.getContractAt("CrowdSource", "0xa436585577918a038DF63116216331258b19017d",Maindeployer)
    //  const response = await crowdsource.revertDonations()
    // console.log(response)

    //     const crowdsource = await ethers.getContractAt("CrowdSource", "0x336988e0c0f740f9761b2fe3703af2fc1ea09c8e",wallet)
    //     const response = await crowdsource.donate({value:ethers.utils.parseEther('5000.10')})
    //    console.log(response)
    
    // const crowdsource = await ethers.getContractAt("CrowdSource", "0x336988e0c0f740f9761b2fe3703af2fc1ea09c8e",deployer)
    // const response = await crowdsource.changeOwner(signer.address)
    // console.log(response)

    // const factory = await ethers.getContractAt("Factory", "0xd3924Aed3dbE4bdBC12FBc5917bBa7202141FE6F",signer)
    // const response = await factory.isOwner("0x336988e0c0f740f9761b2fe3703af2fc1ea09c8e",deployer.address)
    // console.log(response)

    // const crowdsource = await ethers.getContractAt("CrowdSource", "0x336988e0c0f740f9761b2fe3703af2fc1ea09c8e",wallet)
    //     const response = await crowdsource.getMinAmount()
    //    console.log(response)


    const code = await provider.getCode("0x336988e0c0f740f9761b2fe3703af2fc1ea09c8e")
    console.log(code)
}





main().catch((error)=>{
    console.log(error)
})