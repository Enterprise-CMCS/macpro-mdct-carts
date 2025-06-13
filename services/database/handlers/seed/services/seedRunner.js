const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");

let dynamoClient;
let dynamoPrefix;

const runSeed = async (seedInstructions) => {
  const { name, data, tableNameBuilder, keys } = seedInstructions;
  // eslint-disable-next-line no-console
  console.log(`  - ${name}: Seeding`);

  const tableName = tableNameBuilder(dynamoPrefix);
  if (!data || data.length <= 0) return;

  // eslint-disable-next-line no-console
  console.log(`  -  ${tableName}: Updating ${data.length} entries`);
  await updateItems(tableName, data, keys);
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
      await dynamoClient.send(new UpdateCommand(params));
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

const buildSeedRunner = () => {
  const dynamoConfig = {
    logger: {
      debug: console.debug, // eslint-disable-line no-console
      info: console.info, // eslint-disable-line no-console
      warn: console.warn, // eslint-disable-line no-console
      error: console.error, // eslint-disable-line no-console
    },
  };
  const endpoint = process.env.DYNAMODB_URL;
  if (endpoint) {
    dynamoConfig.endpoint = endpoint;
    dynamoConfig.region = "localhost";
    dynamoConfig.credentials = {
      accessKeyId: "LOCALFAKEKEY", // pragma: allowlist secret
      secretAccessKey: "LOCALFAKESECRET", // pragma: allowlist secret
    };
    dynamoPrefix = "localstack";
  } else {
    dynamoConfig["region"] = "us-east-1";
    dynamoPrefix = process.env.dynamoPrefix;
  }

  const bareBonesClient = new DynamoDBClient(dynamoConfig);
  dynamoClient = DynamoDBDocumentClient.from(bareBonesClient);
  return {
    executeSeed: runSeed,
  };
};

module.exports = buildSeedRunner;
