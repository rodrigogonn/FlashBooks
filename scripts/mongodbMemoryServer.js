/**
 * Run mongodb-memory-server as a development replica set
 */
const { MongoMemoryReplSet } = require('mongodb-memory-server');
const path = require('path');
const fs = require('fs');

function getDbPath() {
  const dbPath = path.join(process.cwd(), 'mongo_volume');

  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath);
  }
  return dbPath;
}

async function run() {
  const replicaSet = await MongoMemoryReplSet.create({
    instanceOpts: [
      {
        port: 27017,
        dbPath: getDbPath(),
      },
    ],
    replSet: {
      name: 'rs0',
      storageEngine: 'wiredTiger',
      dbName: 'flash-books',
      ip: '127.0.0.1',
    },
  });

  const uri = replicaSet.getUri();
  process.env.DATABASE_URL = uri;

  console.log(`Mongo running: ${uri}`);
}

try {
  run();
} catch (e) {
  console.log(e);
}
