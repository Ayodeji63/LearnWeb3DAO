const { ethers, getNamedAccounts } = require("hardhat");
const { METADATA_URL, WHITELIST_CONTRACT_ADDRESS } = require("../constants");

const main = async () => {
  const { deployer } = await getNamedAccounts();
  const nftContract = await ethers.getContractFactory("CryptoDevs");
  // const nftContract = await ethers.getContract("CryptoDevs", deployer);
  // console.log("CryptoDevs Contract...");

  const deployedContract = await nftContract.deploy(
    METADATA_URL,
    WHITELIST_CONTRACT_ADDRESS
  );

  // const transactionResponse = await nftContract.deploy({
  //   METADATA_URL,
  //   WHITELIST_CONTRACT_ADDRESS,
  // });
  await deployedContract.deployed();

  // await transactionResponse.wait(1);
  // console.log("Deployed...");

  console.log("NFT Contract Address", deployedContract.address);
};
main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
