await deployments.fixture(["MyContract"]);

 const myContract = await deployments.get("MyContract");

 const contract = await ethers.getContractAt(
      myContract.abi,
      myContract.address
 );
    


 await deployer.sendTransaction({to: crowdsource.address,value: ethers.utils.parseEther("500"),gasLimit: 30000000,})