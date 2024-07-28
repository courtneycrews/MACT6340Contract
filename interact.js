// interact.js

require('dotenv').config();
const Web3 = require('web3');

const ALCHEMY_URL = process.env.ALCHEMY_URL;
const web3 = new Web3(new Web3.providers.HttpProvider(ALCHEMY_URL));

async function main() {
  const account = web3.eth.accounts.privateKeyToAccount(process.env.STUNT_WALLET_PRIVATE_KEY);
  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;

  // Interact with the contract
  console.log('Wallet address:', account.address);
}

main().catch(console.error);