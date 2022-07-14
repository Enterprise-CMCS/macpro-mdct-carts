let dynamoClient;
let pgClient;
let dynamoPrefix;

const runMigration = async (migrationInstructions) => {
  const { name, query, transform, tableNameBuilder } = migrationInstructions;
  // eslint-disable-next-line no-console
  console.log(`  - Loading data from ${name} in postgres v2`);

  const result = await pgClient.query(query);
  const rows = result.rows;
  if (!rows || rows.length <= 0) return;
  // eslint-disable-next-line no-console
  console.log(rows[0]);
  const transformed = transform ? transform(rows) : rows;
  if (transformed && transformed.length > 0) {
    const tableName = tableNameBuilder(dynamoPrefix);
    // eslint-disable-next-line no-console
    console.log(`  - Saving data to ${tableName} in v3`);
    await saveBatch(tableName, transformed);
  }
};

const saveBatch = async (tableName, items) => {
  // DynamoDB batchWriteItem takes 25 items max
  var batch = [];
  for (let i = 0; i < items.length; i++) {
    batch.push({ PutRequest: { Item: items[i] } });
    // Submit every 25, or when you're on the last item
    if (i == items.length - 1 || batch.length == 25) {
      await dynamoClient
        .batchWrite({
          RequestItems: {
            [tableName]: batch,
          },
        })
        .promise();
      batch = []; // clear queue
    }
  }
};

const buildMigrationRunner = () => {
  const aws = require("aws-sdk");
  const { Client } = require("pg");

  const dynamoConfig = {};
  const endpoint = process.env.DYNAMODB_URL;
  if (endpoint) {
    dynamoConfig.endpoint = endpoint;
    dynamoConfig.accessKeyId = "LOCAL_FAKE_KEY"; // pragma: allowlist secret
    dynamoConfig.secretAccessKey = "LOCAL_FAKE_SECRET"; // pragma: allowlist secret
    dynamoPrefix = "local";
  } else {
    dynamoConfig["region"] = "us-east-1";
    dynamoPrefix = process.env.dynamoPrefix;
  }
  dynamoClient = new aws.DynamoDB.DocumentClient(dynamoConfig);

  pgClient = new Client({
    host: process.env.postgresHost,
    database: process.env.postgresDb,
    port: 5432,
    user: process.env.postgresUser,
    password: process.env.postgresPassword,
  });
  pgClient.connect();

  return {
    executeMigration: runMigration,
  };
};

module.exports = buildMigrationRunner;
