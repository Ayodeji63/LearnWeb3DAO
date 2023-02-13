const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });

async function main() {
  const cryptoDevsTokenContract = await ethers.getContractFactory(
    "CryptoDevToken"
  );
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
