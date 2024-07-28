// custom-gas-reporter.js

const Web3 = require('web3');
require('dotenv').config();

const ALCHEMY_URL = process.env.ALCHEMY_URL;
const web3 = new Web3(new Web3.providers.HttpProvider(ALCHEMY_URL));

async function reportGasUsage() {
  const latestBlock = await web3.eth.getBlock('latest');
  console.log('Gas Used in the Latest Block:', latestBlock.gasUsed);
}

reportGasUsage().catch(console.error);