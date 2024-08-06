require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
require("hardhat-gas-reporter"); 

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY;
const ARBISCAN_API_KEY = process.env.ARBISCAN_API_KEY;
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const ALCHEMY_URL = process.env.ALCHEMY_URL;
const LINEA_SEPOLIA_URL = `https://rpc.sepolia.linea.build`;
const STUNT_WALLET_PRIVATE_KEY = process.env.STUNT_WALLET_PRIVATE_KEY;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;

module.exports = {
  etherscan: {
    apiKey: {
      etherMain: ETHERSCAN_API_KEY,
      etherSepolia: ETHERSCAN_API_KEY,
      polygonMain: POLYGONSCAN_API_KEY,
      polygonAmoy: POLYGONSCAN_API_KEY,
      arbitrumOneMain: ARBISCAN_API_KEY,
      arbitrumOneSepolia: ARBISCAN_API_KEY,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS ? true : false,
    currency: 'USD',
    coinmarketcap: COINMARKETCAP_API_KEY,
    token: 'MATIC',
    outputFile: 'gas-report.txt',
    noColors: true,
  },
  defaultNetwork: "amoy",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    amoy: {
      url: `https://rpc-amoy.polygon.technology/`,
      accounts: [STUNT_WALLET_PRIVATE_KEY],
      gasPrice: 25000000000, // Set to 25 Gwei as required
      chainId: 80002,
    },
    polygonMainnet: {
        url: ALCHEMY_URL,
        accounts: [STUNT_WALLET_PRIVATE_KEY],
        gasPrice: 35000000000,
        chainId: 137,
    },
    // lineaSepolia: {
    //     url: `https://rpc.sepolia.linea.build`,
    //     accounts: [STUNT_WALLET_PRIVATE_KEY],
    //     gasPrice: 50000000000,
    //     chainId: 59141,
    // },
    // etherSepolia: {
    //   url: ALCHEMY_URL,
    //   accounts: [STUNT_WALLET_PRIVATE_KEY],
    //   chainId: 11155111,
    // },
    // arbitrumOneSepolia: {
    //   url: ALCHEMY_URL,
    //   accounts: [STUNT_WALLET_PRIVATE_KEY],
    //   chainId: 421614,
    // },
  },
  solidity: {
    version: "0.8.20", // use an exact version here and in contract to avoid verification problems
    settings: {
      optimizer: {
        enabled: false, // may cause verification problems if true
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};