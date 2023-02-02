const { ethers } = require("hardhat");

async function main() {
  // 1. Somehow tell the script we want to deploy the NFTs.Sol contract
  const contract = await ethers.getContractFactory("NFTs");
  // 2. Deploy it
  const deployedContract = await contract.deploy();
  // 2.1 Wait for deployment to finish
  await deployedContract.deployed();
  // 3. Print the address of the deployed contract
  console.log("NFT Contract deployed to: ", deployedContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
