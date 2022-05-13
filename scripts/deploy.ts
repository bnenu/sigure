// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers, artifacts } from "hardhat";
import fs from 'fs';
import { Wallet } from "../typechain";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const [addr1, addr2, addr3] = await ethers.getSigners();
  const WalletFactory = await ethers.getContractFactory("Wallet");
  const wallet = await WalletFactory.deploy([addr1.address, addr2.address, addr3.address], 2);

  await wallet.deployed();

  console.log("Wallet deployed to:", wallet.address);

  fs.writeFileSync('./config.js', `
    export const contractAddress = "${wallet.address}"
    export const approver1 = "${addr1.address}"
    export const approver2 = "${addr2.address}"
    export const approver3 = "${addr3.address}"
  `)

  saveFrontendFiles(wallet)
}

function saveFrontendFiles(contract: Wallet) {
  // const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ Wallet: contract.address }, undefined, 2)
  );

  const WalletArtifact = artifacts.readArtifactSync("Wallet");

  fs.writeFileSync(
    contractsDir + "/Wallet.json",
    JSON.stringify(WalletArtifact, null, 2)
  );
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
