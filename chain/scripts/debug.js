const {ethers,deployments} = require("hardhat")

async function main(){
    
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545") 

    const wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",provider) 

    const cineCrowd = await ethers.getContractAt("CineCrowd","0x7dAe75FEaA222A0153A3a0ec432624C592cb3c70",wallet)
    
    const response = await cineCrowd.getRemainderBalance() 
    console.log(response.toString()) 
    const receipt = await cineCrowd.donate({value: ethers.parseEther('1')})


}





main().catch((error)=>{
    console.log(error)
})