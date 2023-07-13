// I wrapped with function to be able to use "await"
const createContract = async () => {
  // make sure you pass correct path
  // fetching json works in next.js, I believe React18 supprts it
  const res = await fetch("artifacts/contracts/Auction/Auction.json");
  const artifact = await res.json();
  // address is inisde the json file. 5 is goeerli.
  // depending on your config, you might have a different networkId
  const address = artifact.networks[5].address;
  // in react.js window.ethereum will be defined. in next.js you need to add if(window.ethereum){code here}
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const contract = new ethers.Contract(address, artifact.abi, provider);
  return contract;
};
