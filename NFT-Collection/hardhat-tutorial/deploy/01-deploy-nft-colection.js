const { network } = require("hardhat");
const { METADATA_URL, WHITELIST_CONTRACT_ADDRESS } = require("../constants");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const nftContract = await deploy("CryptoDevs", {
    from: deployer,
    args: [METADATA_URL, WHITELIST_CONTRACT_ADDRESS],
    log: true,
  });
  console.log("--------------------");
};
