/* eslint-disable no-console */
const aws = require("aws-sdk");
const isLocal = !!process.env.DYNAMODB_URL;
const localEndpoint = process.env.DYNAMODB_URL;
const sectionTableName = isLocal
  ? "local-section"
  : process.env.dynamoPrefix + "-section";

async function handler() {
  try {
    console.log("Start of data fix");

    const db = buildDynamoClient();

    const results = await scan(db);
    const transformed = await transform(results);
    const keys = ["pk", "sectionId"];
    await updateItems(db, sectionTableName, transformed, keys);

    console.debug("Data fix complete");

    return {
      statusCode: 200,
      body: "All done!",
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: err.message,
    };
  }
}

function buildDynamoClient() {
  if (isLocal) {
    return new aws.DynamoDB.DocumentClient({
      region: "localhost",
      endpoint: localEndpoint,
      accessKeyId: "LOCALFAKEKEY", // pragma: allowlist secret
      secretAccessKey: "LOCALFAKESECRET", // pragma: allowlist secret
    });
  } else {
    return new aws.DynamoDB.DocumentClient({
      region: "us-east-1",
    });
  }
}

async function transform(items) {
  const transformed = items.map((item) => {
    const corrected = { ...item };

    // section 6, question 2 label
    corrected.contents.section.subsections[0].parts[0].questions[1].label =
      "What’s the greatest challenge your CHIP program has faced in FFY 2023?";
    // section 6, question 3 label
    corrected.contents.section.subsections[0].parts[0].questions[2].label =
      "What are some of the greatest accomplishments your CHIP program has experienced in FFY 2023?";
    // section 6, question 4 label
    corrected.contents.section.subsections[0].parts[0].questions[3].label =
      "What changes have you made to your CHIP program in FFY 2023 or plan to make in FFY 2024? Why have you decided to make these changes?";

    return corrected;
  });

  return transformed;
}

async function scan(dynamoClient) {
  let startingKey;
  let existingItems = [];
  let results;

  const queryParams = {
    TableName: sectionTableName,
    ExpressionAttributeNames: {
      "#year": "year",
      "#sectionId": "sectionId",
    },
    ExpressionAttributeValues: {
      ":year": 2023,
      ":sectionId": 6,
    },
    FilterExpression: "#year = :year AND #sectionId = :sectionId",
  };

  const queryTable = async (startingKey) => {
    queryParams.ExclusiveStartKey = startingKey;
    let results = await dynamoClient.scan(queryParams).promise();
    if (results.LastEvaluatedKey) {
      startingKey = results.LastEvaluatedKey;
      return [startingKey, results];
    } else {
      return [null, results];
    }
  };

  // Looping to perform complete scan of tables due to 1 mb limit per iteration
  do {
    [startingKey, results] = await queryTable(startingKey);
    const items = results?.Items;
    existingItems.push(...items);
  } while (startingKey);

  return existingItems;
}

const updateItems = async (db, tableName, items, keys) => {
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
      await db.update(params).promise();
    }
  } catch (e) {
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

handler();
