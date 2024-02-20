/* eslint-disable no-console */
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand
} = require("@aws-sdk/lib-dynamodb");

let dynamoClient;
let dynamoPrefix;

const buildDynamoClient = () => {
  const dynamoConfig = {
    logger: {
      debug: console.debug,
      info: console.info,
      warn: console.warn,
      error: console.error,
    },
  };
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

  const bareBonesClient = new DynamoDBClient(dynamoConfig);
  dynamoClient = DynamoDBDocumentClient.from(bareBonesClient);
};

const scan = async (scanParams) => {
  let ExclusiveStartKey;
  let items = [];

  do {
    const command = new ScanCommand({ ...scanParams, ExclusiveStartKey });
    const result = await dynamoClient.send(command);
    items = items.concat(result.Items ?? []);
    ExclusiveStartKey = result.LastEvaluatedKey;
  } while (ExclusiveStartKey);

  return items;
}

const update = async (tableName, items) => {
  try {
    for (const item of items) {

      const params = {
        TableName: tableName,
        Item: {
          ...item
        },
      };

      const command = new PutCommand(params);
      await dynamoClient.send(command);
    }
  } catch (e) {
    console.log(` -- ERROR UPLOADING ${tableName}\n`, e);
  }
};

module.exports = { buildDynamoClient, scan, update }
