require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

const projectId = process.env.APIKEY
const keyData = process.env.KEYDATA

module.exports = {
  defaultNetwork: 'hardhat',
  networks:{
    hardhat:{
      chainId: 4 //config standered
    },
    mumbai:{
      url: `https://polygon-mumbai.infura.io/v3/${projectId}`,
      accounts:[keyData]
    },
    mainnet:{
      url: `https://mainnet.infura.io/v3/${projectId}`,
      accounts:[keyData]
    },
    rinkeby:{
      url: `https://rinkeby.infura.io/v3/${projectId}`,
      accounts:[keyData]
    }
  },
  solidity: {
    version: "0.8.4",
    settings:{
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
