const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });
const { CRYPTO_DEVS_NFT_CONTRACT_ADDRESS } = require("../constants");

async function main() {
  const cryptoDevsTokenContract = await ethers.getContractFactory(
    "CryptoDevToken"
  );
  const deployContract = await cryptoDevsTokenContract.deploy(
    CRYPTO_DEVS_NFT_CONTRACT_ADDRESS
  );
  console.log("CryptoDev Token Contract Address:", deployContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
