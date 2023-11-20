const dotenv = require('dotenv');
const { Cursor, Db, MongoClient } = require('mongodb');

dotenv.config();

const configPath = process.env.SKIP_SYNCING_CONFIG_PATH;

const config = require(configPath);

function connectToDB() {
  return new Promise((resolve, reject) => {
    let { dbUrl, dbName } = config;
    const connectUrl = dbUrl;

    let attemptConnect = async () => {
      return MongoClient.connect(connectUrl, {
        keepAlive: true,
        poolSize: 50,
        useNewUrlParser: true
      });
    };
    let attempted = 0;
    let attemptConnectId = setInterval(async () => {
      try {
        const client = await attemptConnect();
        const db = client.db(dbName);

        clearInterval(attemptConnectId);

        console.log('Connected to DB');
        resolve(client);
      } catch (err) {
        console.log(err);
        attempted++;
        if (attempted > 5) {
          clearInterval(attemptConnectId);
          reject(new Error('Failed to connect to database'));
        }
      }
    }, 5000);
  });
}

const makeRPCCall = async (chain, method, params = []) => {
  const { host, port, username, password } = config.chains[chain];

  const response = await fetch(`http://${host}:${port}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(username + ':' + password).toString('base64')}`
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method,
      params
    })
  });

  const data = await response.text();

  try {
    return JSON.parse(data).result;
  } catch (e) {
    console.log(response);
    throw new Error(response);
    console.log(chain, 'Error fetching', method, 'for params', params);
  }
};

async function fetchBlocks(chain) {
  const { syncFromBlockHeight } = config.chains[chain];
  const hashes = [];
  const blocks = [];

  console.log('Fetching blocks hashes', chain);
  for (let i = syncFromBlockHeight; i > syncFromBlockHeight - 10 && i > 0; i--) {
    const hash = await makeRPCCall(chain, 'getblockhash', [i]);

    hashes.push(hash);
  }

  console.log('Fetching blocks', chain);
  for (let i = 0; i < hashes.length; i++) {
    const hash = hashes[i];

    const block = await makeRPCCall(chain, 'getblock', [hash]);

    if (block) {
      blocks.push({
        chain,
        hash: block.hash,
        network: 'mainnet',
        bits: block.bits,
        height: block.height,
        merkleRoot: block.merkleroot,
        nextBlockHash: block.nextblockhash,
        nonce: block.nonce,
        previousBlockHash: block.previousblockhash,
        processed: true,
        reward: 1000,
        size: block.size,
        time: new Date(block.time * 1000),
        timeNormalized: new Date(block.mediantime * 1000),
        transactionCount: block.nTx,
        version: block.version
      });
    } else {
      console.log('Block not found for hash', hash);
    }
  }

  return blocks;
}

async function fetchAllBlocks() {
  const chains = Object.keys(config.chains);

  let allBlocks = [];

  for (let i = 0; i < chains.length; i++) {
    const chain = chains[i];

    const blocks = await fetchBlocks(chain);

    allBlocks = allBlocks.concat(blocks);
  }

  return allBlocks;
}

async function insertBlock() {
  console.log('Inserting blocks...');
  const client = await connectToDB();
  const db = client.db(config.dbName);
  const blocks = db.collection('blocks');

  const allBlocks = await fetchAllBlocks();

  for (let i = 0; i < allBlocks.length; i++) {
    const block = allBlocks[i];

    await blocks.updateOne(
      {
        hash: block.hash
      },
      { $set: block },
      { upsert: true }
    );
  }

  // await blocks.insertMany(allBlocks)

  console.log('Closing connection...');
  client.close();
  console.log('Connection closed');
}

insertBlock();
