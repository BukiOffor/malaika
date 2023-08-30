const {network, ethers} = require("hardhat");
const { networkConfig, developmentChains } = require("../helper-hh-config")
const {verify} = require("../utils/verify")


module.exports.default = async({deployments,getNamedAccounts})=>{
    let chainId
    const {deploy,log} = deployments;
    const {deployer} = await getNamedAccounts();

    // chainId = network.config.chainId
    // const initialSupply = networkConfig[chainId].amountNeeded;
    // const minAmount = networkConfig[chainId].minAmount;
    // const priceFeed = networkConfig[chainId].priceFeed;
    //const owner = deployer;

    log('***********Deploying Contract************')
    const factory = await deploy("Factory",{
        from: deployer,
        args: [],
        log: true,
    })
    // const cinecrowd = await deploy("CrowdSource",{
    //     from: deployer,
    //     args: [initialSupply,minAmount,priceFeed,owner,10],
    //     log: true,
    // })

    log(`Contract deployed at ${factory.address}`)
    if (!developmentChains.includes(network.name)) {
        log("verifying.................")
        await verify(factory.address, [])
    }
    log("-------------------------------------------------------")
 

}