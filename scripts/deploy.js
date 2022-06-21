const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {

  // const Apad = await ethers.getContractFactory("Alienpad");
  // const apad = await Apad.deploy();

  const Exchange = await ethers.getContractFactory("Exchange")
  const exchange = await Exchange.deploy("0x640d3178d6cC835c6342514E692A3ed7a26D0C44")

  // await apad.deployed();
  await exchange.deployed()

  console.log("exchange deployed to:", exchange.address);
  // saveFrontendFiles(apad,"Alienpad");
  saveFrontendFiles(exchange,"Exchange");
}

function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
