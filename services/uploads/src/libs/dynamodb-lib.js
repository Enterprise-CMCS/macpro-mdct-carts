const AWS = require("aws-sdk");
const dyanmoConfig = {};

// ugly but OK, here's where we will check the environment
const endpoint = process.env.DYNAMODB_URL;
if (endpoint) {
  dyanmoConfig.endpoint = endpoint;
  dyanmoConfig.accessKeyId = "LOCALFAKEKEY"; // pragma: allowlist secret
  dyanmoConfig.secretAccessKey = "LOCALFAKESECRET"; // pragma: allowlist secret
} else {
  dyanmoConfig["region"] = "us-east-1";
}

const client = new AWS.DynamoDB.DocumentClient(dyanmoConfig);

module.exports = {
  scan: (params) => client.scan(params).promise(),
};
