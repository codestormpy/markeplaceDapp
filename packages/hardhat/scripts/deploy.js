const { ethers, artifacts } = require("hardhat")
const hre = require("hardhat")
const fs = require("fs")
// const tap = require("../../react-app/")

async function main() {
    // const [ deployer ] = await ethers.getSigners()

    // console.log("Deploying contract with the account: ", deployer.address)

    const MarketPlaceFactory = await hre.ethers.deployContract("Marketplace")
    console.log("Deploying Contract......")
    await MarketPlaceFactory
    
    console.log(`MarketPlace Address: ${await MarketPlaceFactory.address}`)

    // store to the react folder
    storeContractData(MarketPlaceFactory)
}


// function to store our abi in a folder to able to get easier
function storeContractData(contract) {
    const constractDir = __dirname + "/../../react-app/abi";
    if (!fs.existsSync(constractDir)) {
        fs.mkdirSync(constractDir);
    }

    fs.writeFileSync(
        constractDir + "/Marketplace-address.json",
        JSON.stringify({ Address: contract.address }, undefined, 2)

    )

    const MarketPlaceArtifacts = artifacts.readArtifactSync("Marketplace")

    fs.writeFileSync(constractDir + "/Marketplace.json", JSON.stringify(MarketPlaceArtifacts, null, 2))
}
main().then(() => process.exit(0).catch((error) => {
    console.log(error);
    process.exit(1)
}))