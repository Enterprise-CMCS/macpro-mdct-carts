const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

let dynamoClient;

export const buildClient = () => {
  if (dynamoClient) return dynamoClient;
  const dynamoConfig = {};
  const endpoint = process.env.DYNAMODB_URL;
  if (endpoint) {
    dynamoConfig.endpoint = endpoint;
    dynamoConfig.accessKeyId = "LOCALFAKEKEY"; // pragma: allowlist secret
    dynamoConfig.secretAccessKey = "LOCALFAKESECRET"; // pragma: allowlist secret
  } else {
    dynamoConfig["region"] = "us-east-1";
  }
  const bareBonesClient = new DynamoDBClient(dynamoConfig);
  dynamoClient = DynamoDBDocumentClient.from(bareBonesClient);
  return dynamoClient;
};

export const convertToDynamoExpression = (listOfVars) => {
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
