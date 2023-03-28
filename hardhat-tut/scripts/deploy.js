const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  const Token = ethers.getContractFactory("Token");
  const token = (await Token).deploy();

  (await token).deployed();

  console.log(`Contract Deployed with addres`, (await token).address);
}

main().catch((e) => {
  console.log(e);
  process.exit(1);
});
