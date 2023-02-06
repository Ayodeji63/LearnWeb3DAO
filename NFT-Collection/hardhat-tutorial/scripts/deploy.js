const { ethers } = require("hardhat");
const { METADATA_URL, WHITELIST_CONTRACT_ADDRESS } = require("../constants");

const main = async () => {
  const nftContract = await ethers.getContractFactory("CryptoDevs");

  const deployedContract = await nftContract.deploy(
    METADATA_URL,
    WHITELIST_CONTRACT_ADDRESS
  );

  await deployedContract.deployed();

  console.log("NFT Contract Address", deployedContract.address);
};
main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
