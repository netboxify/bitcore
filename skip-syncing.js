require('dotenv').config();

const dbUser = process.env['MONGO_DB_USERNAME'];
const dbPass = process.env['MONGO_DB_PASSWORD'];
const dbCred = dbUser !== '' && dbPass !== '' ? `${dbUser}:${dbPass}@` : '';

const dbHost = process.env['MONGO_DB_HOST'];
const dbPort = process.env['MONGO_DB_PORT'];
const dbName = process.env['MONGO_DB_NAME'];

module.exports = {
  dbUrl: `mongodb://${dbCred}${dbHost}:${dbPort}/${dbName}?socketTimeoutMS=3600000&noDelay=true`,
  dbName: 'bitcore',
  chains: {
    LTC: {
      host: process.env['LTC_NODE_HOST'],
      port: process.env['LTC_NODE_RPC_PORT'],
      username: process.env['LTC_NODE_USERNAME'],
      password: process.env['LTC_NODE_PASSWORD'],
      syncFromBlockHeight: 2583220
    },
    BTC: {
      host: process.env['BTC_NODE_HOST'],
      port: process.env['BTC_NODE_RPC_PORT'],
      username: process.env['BTC_NODE_USERNAME'],
      password: process.env['BTC_NODE_PASSWORD'],
      syncFromBlockHeight: 817602
    },
    BCH: {
      host: process.env['BCH_NODE_HOST'],
      port: process.env['BCH_NODE_RPC_PORT'],
      username: process.env['BCH_NODE_USERNAME'],
      password: process.env['BCH_NODE_PASSWORD'],
      syncFromBlockHeight: 819112
    },
    DOGE: {
      host: process.env['DOGE_NODE_HOST'],
      port: process.env['DOGE_NODE_RPC_PORT'],
      username: process.env['DOGE_NODE_USERNAME'],
      password: process.env['DOGE_NODE_PASSWORD'],
      syncFromBlockHeight: 4973094
    },
    DASH: {
      host: process.env['DASH_NODE_HOST'],
      port: process.env['DASH_NODE_RPC_PORT'],
      username: process.env['DASH_NODE_USERNAME'],
      password: process.env['DASH_NODE_PASSWORD'],
      syncFromBlockHeight: 1974324
    }
  }
};
