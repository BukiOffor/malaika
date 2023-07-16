const { ethers, deployments, network } = require("hardhat")
const { expect, assert, should } = require("chai")
const { developmentChains, networkConfig } = require("../helper-hh-config")

developmentChains.includes(network.name) &&
    describe("CrowdSource", function () {
        let deployer, provider
        let Contractfactory, chainId, contract
        let contractAddress, crowdsource, amount
        beforeEach(async () => {
            amount = "10000"
            ;[deployer] = await ethers.getSigners()
            await deployments.fixture()
            const myContract = await deployments.get("Factory")
            Contractfactory = await ethers.getContractAt(
                myContract.abi,
                myContract.address
            )
            chainId = network.config.chainId
            contract = await Contractfactory.CreateCrowdSource(
                amount,
                "500",
                networkConfig[chainId].priceFeed,
                deployer.getAddress(),
                10
            )
            provider = Contractfactory.provider
            const logs = await provider.getLogs({
                address: Contractfactory.address,
                topics: [
                    "0x1bbdae750438509a344ebf8a0bf269e2dddc83b20244f7b8a9772131f260313c",
                ],
                blockHash: await contract.blockHash,
            })
            contractAddress = ethers.utils.hexStripZeros(logs[0].topics[1])
            crowdsource = await ethers.getContractAt(
                "CrowdSource",
                contractAddress,
                deployer
            )
            //const response = await crowdsource.donate({
            //   value: ethers.utils.parseEther("1"),
            // })
            //await response.wait(1)
        })

        describe("constructor", function () {
            it("initialises properly", async () => {
                const amountNeeded = await provider.getStorageAt(
                    contractAddress,
                    0x00
                )
                const minAmount = await provider.getStorageAt(
                    contractAddress,
                    0x01
                )
                assert.equal(amountNeeded, 10000e18)
                assert.equal(minAmount, 500e18)
            })
        })

        describe("Donate", function () {
            it("rejects transaction if amount is below minimum amount", async () => {
                await expect(
                    crowdsource.donate({
                        value: ethers.utils.parseEther("0.001"),
                    })
                ).to.be.revertedWithCustomError(crowdsource, "NotenoughAmount")
            })
            it("allows transaction if amount is above minimum amount", async () => {
                await expect(
                    crowdsource.donate({
                        value: ethers.utils.parseEther("0.5"),
                    })
                ).not.to.be.reverted
            })
            it("reverts transaction if amount donated is above remaining balance", async () => {
                await expect(
                    crowdsource.donate({ value: ethers.utils.parseEther("50") })
                ).to.be.revertedWithCustomError(
                    crowdsource,
                    "AmountDonatingGreaterThanRemainingAmountNeeded"
                )
            })
            it("writes share holders on chain", async () => {
                const response = await crowdsource.donate({
                    value: ethers.utils.parseEther("1"),
                })
                await response.wait(1)
                const donater = await crowdsource.shareholders(0)
                expect(donater).to.hexEqual(deployer.address)
            })
            it("transfers liquidity token to the donater", async () => {
                const accounts = await ethers.getSigners()
                await crowdsource
                    .connect(accounts[10])
                    .donate({ value: ethers.utils.parseEther("0.5") })
                const accountLp = await crowdsource.getLiquidityToken(
                    accounts[10].address
                )
                const value = ethers.utils.parseUnits("0.5", "ether")
                expect(await crowdsource.getPercentage(BigInt(value))).to.equal(
                    accountLp
                )
            })
            it("emits transaction event", async () => {
                await expect(
                    crowdsource.donate({
                        value: ethers.utils.parseEther("0.5"),
                    })
                ).to.emit(crowdsource, "Donated")
            })
        })
        describe("getRemainderBalance", () => {
            it("gets the balance of the contract at all times in USD", async () => {
                const balanceBeforeTransaction =
                    await crowdsource.getRemainderBalance()
                await crowdsource.donate({
                    value: ethers.utils.parseEther("1"),
                })
                const UsdAmountInEth =
                    (await crowdsource.getLatestPrice()) / 1e18 //gets the price of 1 ETH in USD
                const balanceAfterTransaction =
                    await crowdsource.getRemainderBalance()
                //Further divide balance by 1e18 to get the exact figure because its multiplied by 1e18 in contract
                expect(parseInt(amount)).to.equal(
                    parseInt(balanceBeforeTransaction) / 1e18
                )
                expect(parseInt(amount - UsdAmountInEth)).to.equal(
                    Math.trunc(parseInt(balanceAfterTransaction) / 1e18)
                )
            })
        })
        describe("getPercentage", () => {
            //mathematics: calculating the percentage of 1ETH
            it("calculates the percentage of amount funded by the funder", async () => {
                const simulatedPercentage =
                    (((await crowdsource.getLatestPrice()) / 1e18) * 100) /
                    amount
                await crowdsource.donate({
                    value: ethers.utils.parseEther("1"),
                })
                const percentage = await crowdsource.getPercentage(BigInt(1e18))
                expect(simulatedPercentage * 1e18).to.equal(
                    parseInt(percentage)
                )
            })
        })

        describe("returnShares", () => {
            it("returns the share amount of a funder", async () => {
                const simulatedPercentage =
                    (((await crowdsource.getLatestPrice()) / 1e18) * 100) /
                    amount
                await crowdsource.donate({
                    value: ethers.utils.parseEther("1"),
                })
                const share = await crowdsource.returnShare(deployer.address)
                expect(simulatedPercentage * 1e18).to.equal(parseInt(share))
            })
        })
        describe("revertDonations", () => {
            it("reverts the donations", async () => {
                const accounts = await ethers.getSigners()
                for (let i = 10; i < accounts.length; i++) {
                    await crowdsource
                        .connect(accounts[i])
                        .donate({ value: ethers.utils.parseEther("0.29") })
                }
                const balanceBeforeRefund = await ethers.provider.getBalance(
                    crowdsource.address
                )
                await crowdsource.revertDonations()
                const balanceAfterRefund = await provider.getBalance(
                    crowdsource.address
                )
                assert.equal(0, balanceAfterRefund)
                assert.equal(balanceBeforeRefund, BigInt(0.29e18 * 10))
            })
            it("can only be called by the owner", async () => {
                const signer = await ethers.getSigners()
                await expect(
                    crowdsource.connect(signer[7]).revertDonations()
                ).to.be.revertedWithCustomError(crowdsource, "NotOwner")
            })
            it("destroys its self after function is called", async () => {
                const byteCodeB4revert = await provider.getCode(
                    crowdsource.address
                )
                await crowdsource.revertDonations()
                const byteCodeAfterRevert = await provider.getCode(
                    crowdsource.address
                )
                assert.notEqual(byteCodeB4revert, "0x")
                assert.equal(byteCodeAfterRevert, "0x")
            })
        })
        describe("withdraw", () => {
            it("reject when called by not owner", async () => {
                const signer = await ethers.getSigner(7)
                const balance = await crowdsource.getBalanceInEth()
                const signerContract = await crowdsource.connect(signer)
                await signerContract.donate({ value: balance })
                await expect(
                    signerContract.withdraw()
                ).to.be.revertedWithCustomError(crowdsource, "NotOwner")
            })
            it("cannot withdraw if balance is less than Amount needed", async () => {
                await crowdsource.donate({ value: BigInt(3e18) })
                await expect(
                    crowdsource.withdraw()
                ).to.be.revertedWithCustomError(
                    crowdsource,
                    "AmountNeededNotRaised"
                )
            })
            it("can be withdraw by the owner", async () => {
                const balance = await crowdsource.getBalanceInEth()
                await crowdsource.donate({ value: balance })
                await expect(crowdsource.withdraw()).to.not.be.reverted
            })
            it("withdraws the funds", async () => {
                const amountNeeded = await crowdsource.getBalanceInEth()
                await crowdsource.donate({ value: amountNeeded })
                const balanceAfterDonation = await provider.getBalance(
                    crowdsource.address
                )
                await crowdsource.withdraw()
                assert.isAbove(balanceAfterDonation, 0)
                expect(await provider.getBalance(crowdsource.address)).to.equal(
                    0
                )
            })
            it("can only be withdraw once", async () => {
                const amountNeeded = await crowdsource.getBalanceInEth()
                await crowdsource.donate({ value: amountNeeded })
                await crowdsource.withdraw()
                await deployer.sendTransaction({
                    to: crowdsource.address,
                    value: ethers.utils.parseEther("500"),
                    gasLimit: 30000000,

                })
                await expect(
                    crowdsource.withdraw()
                ).to.be.revertedWithCustomError(
                    crowdsource,
                    "SeedValueAlreadyWithdrawn"
                )
            })
            it("sets value of withdraw to true once amount is withdrawn", async () => {
                const amountNeeded = await crowdsource.getBalanceInEth()
                await crowdsource.donate({ value: amountNeeded })
                await crowdsource.withdraw()
                const valueAfterWithdrawal = await provider.getStorageAt(
                    crowdsource.address,
                    0x04
                )
                const value = valueAfterWithdrawal.toString().slice(0, 64)
                expect(valueAfterWithdrawal.toString()).to.equal(value + "01")
            })
        })

        describe("distributeReturns", () => {
            it("contract rejects funds id project is not live", async () => {
                await expect( deployer.sendTransaction({
                    to: crowdsource.address,
                    value: ethers.utils.parseEther("500"),
                    gasLimit: 30000000,
                })
                ).to.emit(crowdsource,"ReversedTransaction")             
            })
            it("distributes amount succesfully", )
        })
        describe("Change Ownership", () => {
            let seller, buyer, buyerContract
            beforeEach(async () => {
                seller = await ethers.getSigner(5);
                buyer = await ethers.getSigner(6);
                buyerContract = await crowdsource.connect(buyer)
                await buyerContract.donate({ value: BigInt(1e18) })
                await crowdsource.donate({ value: ethers.utils.parseEther("0.8") })

            })
            it('transfers full ownership when called',async () => {
                const addressb4Sale = await buyerContract.shareholders(1);
                const Tokens = await buyerContract.getLiquidityToken(buyer.address);
                const receipt = await buyerContract.transferFullShare(seller.address);
                await receipt.wait(1)
                const address = await buyerContract.shareholders(1);
                expect(addressb4Sale).to.hexEqual(buyer.address);
                expect(address).to.hexEqual(seller.address);
                expect(Tokens).to.equal(await buyerContract.getLiquidityToken(seller.address));
                expect(0).to.equal(await crowdsource.getLiquidityToken(buyer.address));


            })
            it('transfers part ownership when called', async () => {
                const minter = await ethers.getSigner(10)
                const Tokens = await crowdsource.getLiquidityToken(deployer.address);
                await crowdsource.transferShare(minter.address, BigInt(8e10))
                const address = await crowdsource.shareholders(3);
                const balance = BigInt(Tokens) - BigInt(8e10);
                expect(address).to.hexEqual(minter.address);
                expect(balance).to.equal(await crowdsource.getLiquidityToken(deployer.address))
                expect(await crowdsource.getLiquidityToken(minter.address)).to.equal(8e10);
              
            })
        
        })

    })
