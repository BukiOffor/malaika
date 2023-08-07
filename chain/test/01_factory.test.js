const { ethers, deployments, network,hre } = require("hardhat")
const { expect, assert, should } = require("chai")
const { developmentChains, networkConfig } = require("../helper-hh-config")

developmentChains.includes(network.name) &&
    describe("Factory", function () {
        let deployer
        let Contractfactory, chainId, contract
        beforeEach(async () => {
            [deployer] = await ethers.getSigners()
            await deployments.fixture()

            const myContract = await deployments.get("Factory");
            Contractfactory = await ethers.getContractAt(
                myContract.abi,
                myContract.address
            );
            chainId = network.config.chainId
            contract = await Contractfactory.CreateCrowdSource(
                "1000",
                "50",
                networkConfig[chainId].priceFeed,
                deployer.getAddress(),
                10,
                { value: ethers.utils.parseEther("0.2") }
            )
        })
        describe("CreateCrowdSource", function () {
            let crowdsourceAddress, provider;
            beforeEach(async()=>{
                provider = await Contractfactory.provider;
                const hash = ethers.utils.id("CrowdSourceCreated(address,address,uint256)")
                const logs = await provider.getLogs({
                    address: await Contractfactory.address,
                    topics: [hash],
                    blockHash: await contract.blockHash,
                })
                crowdsourceAddress = ethers.utils.hexStripZeros(logs[0].topics[1])
            })
            it("should create a contract that exists on chain", async()=>{    
                const byteCode = await provider.getCode(crowdsourceAddress);
                assert.notEqual(byteCode, '0x')
                expect(crowdsourceAddress).to.be.a.properAddress;
            })
            
            it("should emit a new event", async () => {
               expect(contract).to.emit(Contractfactory, "CrowdSourceCreated")          
            })
            
            it('creates a mapping of index number to address', async()=>{
                const key = ethers.utils.hexZeroPad('0x01',32)
                const position = ethers.utils.hexZeroPad('0x01',32).slice(2)
                const hash = ethers.utils.keccak256(key + position)
                const value = await provider.getStorageAt(
                    Contractfactory.address,
                    hash
                )
                expect(value).to.hexEqual(crowdsourceAddress);
            })     
        })
        describe("RetrieveMarketPlace", ()=>{
            it("should return every contract in the market place", async()=>{
                for (let i = 0; i<5; i++) {await Contractfactory.CreateCrowdSource(
                    "1000",
                    "50",
                    networkConfig[chainId].priceFeed,
                    deployer.getAddress(),
                    10,
                    { value: ethers.utils.parseEther("0.5") }

                )}
                const marketplace = await Contractfactory.getMarketPlace();
                expect(marketplace).to.have.a.lengthOf(6); //we expect 6 addr because 1 address was added in the beforeEach hook
            })
        })
    })
