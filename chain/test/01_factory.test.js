const { ethers, deployments, network } = require("hardhat")
const { expect, assert, should } = require("chai")
const { developmentChains, networkConfig } = require("../helper-hh-config")

developmentChains.includes(network.name) &&
    describe("Factory", function () {
        let deployer
        let Contractfactory, chainId, contract
        beforeEach(async () => {
            ;[deployer] = await ethers.getSigners()
            await deployments.fixture()
            Contractfactory = await ethers.getContract("Factory", deployer)
            chainId = network.config.chainId
            contract = await Contractfactory.CreateCrowdSource(
                "1000",
                "50",
                networkConfig[chainId].priceFeed,
                deployer.getAddress()
            )
        })
        describe("CreateCrowdSource", function () {
            it("should emit a new event", async () => {
                expect(contract).to.emit(Contractfactory, "CrowdSourceCreated")          
            })
            it("should create a contract that exists on chain", async()=>{
                //const blockNumber = contract.blockNumber;
                const provider = await contract.provider
                //const eventInbyte = ethers.toUtf8Bytes("CrowdSourceCreated(address,address,uint)")
                //const hash = ethers.keccak256(eventInbyte)
                //const hash = ethers.id("CrowdSourceCreated(address,address,uint)")
                const logs = await provider.getLogs({
                    address: await Contractfactory.getAddress(),
                    topics: [
                        "0x1bbdae750438509a344ebf8a0bf269e2dddc83b20244f7b8a9772131f260313c",
                    ],
                    blockHash: await contract.blockHash,
                })
                const crowdsourceAddress = ethers.stripZerosLeft(logs[0].topics[1])
                const byteCode = await provider.getCode(crowdsourceAddress)
                

            })

        })
    })
