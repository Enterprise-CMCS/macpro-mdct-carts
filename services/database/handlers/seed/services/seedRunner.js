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

const buildSeedRunner = () => {
  const aws = require("aws-sdk");

  const dynamoConfig = {};
  const endpoint = process.env.DYNAMODB_URL;
  if (endpoint) {
    dynamoConfig.endpoint = endpoint;
    dynamoConfig.accessKeyId = "LOCALFAKEKEY"; // pragma: allowlist secret
    dynamoConfig.secretAccessKey = "LOCALFAKESECRET"; // pragma: allowlist secret
    dynamoPrefix = "local";
  } else {
    dynamoConfig["region"] = "us-east-1";
    dynamoPrefix = process.env.dynamoPrefix;
  }

  dynamoClient = new aws.DynamoDB.DocumentClient(dynamoConfig);
  return {
    executeSeed: runSeed,
  };
};

module.exports = buildSeedRunner;
