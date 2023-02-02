const { ethers } = require("hardhat");

const main = async () => {
  // gets the contract
  const whitelistContract = await ethers.getContractFactory("Whitelist");

  // this acutally deploy the contract
  const deployedWhitelistContract = await whitelistContract.deploy(10);

  // then we wait for the contract ot deploy
  await deployedWhitelistContract.deployed();

  // then we log the address to the console
  console.log("Whitelist Contract Address", deployedWhitelistContract.address);
};

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
