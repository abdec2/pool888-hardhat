const hre = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");

require('dotenv').config()

const provider = ethers.providers.getDefaultProvider('http://127.0.0.1:8545/')
const stakingContract = '0x0CE5bbfD76027B5269Ef16e1f26eeB3bC9c3b95D'
const abi = require('./../artifacts/contracts/Masterchef.sol/MasterChef.json').abi
const TokenAbi = require('./../artifacts/contracts/token.sol/MyToken.json').abi


async function main() {
    const address = "0x5baA0f14D09864929c5fC8AbDfDc466dcb72be9d";
    await helpers.impersonateAccount(address);
    const impersonatedSigner = await ethers.getSigner(address);

    const contract = new ethers.Contract('0xAE90A6e8470eCbB888b37Ec68E982D7507d7D3c8', TokenAbi, impersonatedSigner)
    const pending = await contract.approve(stakingContract, 10000000)
    console.log(pending)
    const contract1 = new ethers.Contract(stakingContract, abi, impersonatedSigner)
    const pending1 = await contract1.deposit(0, 10000000, 1, ethers.constants.AddressZero)
    console.log(pending1)

    const pending2 = await contract1.userInfo(0, address)
    console.log(pending2)
    

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});