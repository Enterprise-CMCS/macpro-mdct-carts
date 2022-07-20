let dynamoClient;
let pgClient;
let dynamoPrefix;

const runMigration = async (migrationInstructions) => {
  const { name, query, transform, tableNameBuilder, keys } =
    migrationInstructions;
  // eslint-disable-next-line no-console
  console.log(`  - ${name}: Loading data from postgres (v2)`);

  // Extract
  const result = await pgClient.query(query);
  const rows = result.rows;
  if (!rows || rows.length <= 0) return;

  // Transform
  const transformed = transform ? transform(rows) : rows;

  // Load
  if (transformed && transformed.length > 0) {
    const tableName = tableNameBuilder(dynamoPrefix);
    // eslint-disable-next-line no-console
    console.log(`  -  ${tableName}: Saving ${rows.length} entries (v3)`);
    await updateItems(tableName, transformed, keys);
  }
};

const updateItems = async (tableName, items, keys) => {
  try {
    for (const item of items) {
      let key = {};
      for (const k of keys) {
        key[k] = item[k];
        delete item[k];
      }

      const params = {
        TableName: tableName,
        Key: key,
        ...convertToDynamoExpression(item),
      };
      await dynamoClient.update(params).promise();
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(` -- ERROR UPLOADING ${tableName}\n`, e);
  }
};

const convertToDynamoExpression = (listOfVars) => {
  let expressionAttributeNames = {};
  let expressionAttributeValues = {};
  let updateExpression = "";
  Object.keys(listOfVars).forEach((key, index) => {
    expressionAttributeNames[`#${key}`] = key;
    expressionAttributeValues[`:${key}`] = listOfVars[key];

    updateExpression =
      index === 0
        ? `set #${key}=:${key}`
        : `${updateExpression}, #${key}=:${key}`;
  });
  return {
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  };
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
