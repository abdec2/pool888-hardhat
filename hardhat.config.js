require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "mumbai",
  networks: {
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/7GgqThz-Pqbk5xcWy5wTHi6WGzZFPBou",
      accounts: [process.env.PRIVATE_KEY]
    }
  },

  solidity: "0.8.17",
};
