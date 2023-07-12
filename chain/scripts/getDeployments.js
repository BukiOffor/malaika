await deployments.fixture(["MyContract"]);

 const myContract = await deployments.get("MyContract");

 const contract = await ethers.getContractAt(
      myContract.abi,
      myContract.address
    );
  