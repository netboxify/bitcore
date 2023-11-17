require("dotenv").config()

const dbUser = process.env["MONGO_DB_USERNAME"]
const dbPass = process.env["MONGO_DB_PASSWORD"]
const dbCred = dbUser !== "" && dbPass !== "" ? `${dbUser}:${dbPass}@` : ""


const dbHost = process.env["MONGO_DB_HOST"]
const dbPort = process.env["MONGO_DB_PORT"]
const dbName = process.env["MONGO_DB_NAME"]

module.exports = {
  "bitcoreNode": {
    "port": 6868,
    "dbUrl": `mongodb://${dbCred}${dbHost}:${dbPort}/${dbName}?socketTimeoutMS=3600000&noDelay=true`,
    "modules": ["./bitcoin", "./bitcoin-cash", "./dash", "./dogecoin", "./litecoin"],
    "services": {
      "api": {
        "wallets": {
          "allowCreationBeforeCompleteSync": false
        }
      }
    },
    "chains": {
      "LTC": {
        "mainnet": {
          "trustedPeers": [
            {
              "host": process.env["LTC_NODE_HOST"],
              "port": process.env["LTC_NODE_PORT"]
            }
          ],
          "rpc": {
            "host": process.env["LTC_NODE_HOST"],
            "port": process.env["LTC_NODE_RPC_PORT"],
            "username": process.env["LTC_NODE_USERNAME"],
            "password": process.env["LTC_NODE_PASSWORD"]
          }
        }
      },
      "BTC": {
        "mainnet": {
          "chainSource": "p2p",
          "trustedPeers": [
            {
              "host": process.env["BTC_NODE_HOST"],
              "port": process.env["BTC_NODE_PORT"]
            }
          ],
          "rpc": {
            "host": process.env["BTC_NODE_HOST"],
            "port": process.env["BTC_NODE_RPC_PORT"],
            "username": process.env["BTC_NODE_USERNAME"],
            "password": process.env["BTC_NODE_PASSWORD"]
          }
        }
      },
      "BCH": {
        "mainnet": {
          "parentChain": "BTC",
          "forkHeight": 478558,
          "trustedPeers": [
            {
              "host": process.env["BCH_NODE_HOST"],
              "port": process.env["BCH_NODE_PORT"]
            }
          ],
          "rpc": {
            "host": process.env["BCH_NODE_HOST"],
            "port": process.env["BCH_NODE_RPC_PORT"],
            "username": process.env["BCH_NODE_USERNAME"],
            "password": process.env["BCH_NODE_PASSWORD"]
          }
        }
      },
      "DOGE": {
        "mainnet": {
          "trustedPeers": [
            {
              "host": process.env["DOGE_NODE_HOST"],
              "port": process.env["DOGE_NODE_PORT"]
            }
          ],
          "rpc": {
            "host": process.env["DOGE_NODE_HOST"],
            "port": process.env["DOGE_NODE_RPC_PORT"],
            "username": process.env["DOGE_NODE_USERNAME"],
            "password": process.env["DOGE_NODE_PASSWORD"]
          }
        }
      },
      "DASH": {
        "mainnet": {
          "trustedPeers": [
            {
              "host": process.env["DASH_NODE_HOST"],
              "port": process.env["DASH_NODE_PORT"]
            }
          ],
          "rpc": {
            "host": process.env["DASH_NODE_HOST"],
            "port": process.env["DASH_NODE_RPC_PORT"],
            "username": process.env["DASH_NODE_USERNAME"],
            "password": process.env["DASH_NODE_PASSWORD"]
          }
        }
      }
    }
  }
}
