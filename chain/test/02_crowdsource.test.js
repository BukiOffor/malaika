const { ethers, deployments, network } = require("hardhat")
const { expect, assert, should } = require("chai")
const { developmentChains, networkConfig } = require("../helper-hh-config")

developmentChains.includes(network.name) &&
    describe("CrowdSource", function () {
        let deployer, provider
        let Contractfactory, chainId, contract
        let contractAddress, crowdsource
        beforeEach(async () => {
            ;[deployer] = await ethers.getSigners()
            await deployments.fixture()
            const myContract = await deployments.get("Factory");
            Contractfactory = await ethers.getContractAt(
                myContract.abi,
                myContract.address
            );
            chainId = network.config.chainId
            contract = await Contractfactory.CreateCrowdSource(
                "10000",
                "500",
                networkConfig[chainId].priceFeed,
                deployer.getAddress()
            )
            provider = await contract.provider
            const logs = await provider.getLogs({
                address: await Contractfactory.getAddress(),
                topics: [
                    "0x1bbdae750438509a344ebf8a0bf269e2dddc83b20244f7b8a9772131f260313c",
                ],
                blockHash: await contract.blockHash,
            })
            contractAddress = ethers.stripZerosLeft(logs[0].topics[1])
            crowdsource = await ethers.getContractAt(
                "CrowdSource",
                contractAddress,
                deployer
            )
            const response = await crowdsource.donate({ value: ethers.parseEther("1") })
            await response.wait(1);
        })

        describe("constructor", function () {
            it("initialises properly", async () => {
                const amountNeeded = await provider.getStorage(
                    contractAddress,
                    0x00
                )
                const minAmount = await provider.getStorage(
                    contractAddress,
                    0x01
                )
                assert.equal(amountNeeded, 10000e18)
                assert.equal(minAmount, 500e18)
            })
        })

        describe("Donate", function () {
            it("requires a minimum amount", async () => {
                const receipt = await crowdsource.donate({ value: ethers.parseEther("0.001") })
                await expect(
                     receipt.wait(1)
                ).to.be.revertedWithCustomError(crowdsource, "notenoughAmount")                   
            })
            it("allows transaction if amount is above minimum amount", async () => {
               await expect(
                    crowdsource.donate({ value: ethers.parseEther("0.5") })
                ).not.to.be.reverted
            })
        })
    })
