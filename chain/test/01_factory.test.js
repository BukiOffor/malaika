const { ethers, deployments, network } = require("hardhat")
const { expect, assert, should } = require("chai")
const { developmentChains, networkConfig } = require("../helper-hh-config")

developmentChains.includes(network.name) &&
    describe("Factory", function () {
        let deployer
        let Contractfactory, chainId, contract
        beforeEach(async () => {
            [deployer] = await ethers.getSigners()
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
            let crowdsourceAddress, provider;
            beforeEach(async()=>{
                provider = await contract.provider
                //const hash = ethers.id("CrowdSourceCreated(address,address,uint)")
                const logs = await provider.getLogs({
                    address: await Contractfactory.getAddress(),
                    topics: [
                        "0x1bbdae750438509a344ebf8a0bf269e2dddc83b20244f7b8a9772131f260313c",
                    ],
                    blockHash: await contract.blockHash,
                })
                crowdsourceAddress = ethers.stripZerosLeft(logs[0].topics[1])
            })
            
            it("should emit a new event", async () => {
                expect(contract).to.emit(Contractfactory, "CrowdSourceCreated")          
            })
            it("should create a contract that exists on chain", async()=>{    
                const byteCode = await provider.getCode(crowdsourceAddress);
                assert.notEqual(byteCode, '0x')
            })
            it('creates a mapping of index number to address', async()=>{
                const key = ethers.zeroPadValue('0x01',32)
                const position = ethers.zeroPadValue('0x01',32).slice(2)
                const hash = ethers.keccak256(key + position)
                const value = await provider.getStorage(
                    Contractfactory.getAddress(),
                    hash
                )
                assert.equal(ethers.stripZerosLeft(value), crowdsourceAddress);
            })        
        })
        describe("retrieveMarketPlace", ()=>{
            it("should return every contract in the market place", async()=>{
                for (let i = 0; i<5; i++) {await Contractfactory.CreateCrowdSource(
                    "1000",
                    "50",
                    networkConfig[chainId].priceFeed,
                    deployer.getAddress()
                )}
                const marketplace = await Contractfactory.getMarketPlace();
                expect(marketplace).to.have.a.lengthOf(6); //we expect 6 addr because 1 address was added in the beforeEach hook
            })
        })
    })
