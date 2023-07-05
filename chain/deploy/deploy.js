const {network, ethers} = require("hardhat");
const{networkConfig} = require("../helper-hh-config")

module.exports.default = async({deployments,getNamedAccounts})=>{
    let chainId
    const {deploy,log} = deployments;
    const {deployer} = await getNamedAccounts();

    chainId = network.config.chainId
    const initialSupply = networkConfig[chainId].amountNeeded;
    const minAmount = networkConfig[chainId].minAmount;
    const priceFeed = networkConfig[chainId].priceFeed;
    const owner = deployer;

    log('***********Deploying Contract************')
    const cinecrowd = await deploy("CineCrowd",{
        from: deployer,
        args: [initialSupply,minAmount,priceFeed,owner],
        log: true,
    })

    log(`Contract deployed at ${cinecrowd.address}`)
 

}