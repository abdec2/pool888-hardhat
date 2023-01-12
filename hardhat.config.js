require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "mumbai",
  networks: {
    mumbai: {
      url: process.env.PRIVATE_KEY,
      accounts: [process.env.ALCHEMY_KEY]
    }
  },

  solidity: "0.8.17",
};
