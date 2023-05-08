let dynamoClient;
let dynamoPrefix;
// eslint-disable-next-line no-unused-vars
async function myHandler(event, context, callback) {
  // eslint-disable-next-line no-console
  console.log("Start of data fix");

  const aws = require("aws-sdk");

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

  const results = await scan(dynamoClient);
  console.log(results, 'results');

  const transformed = transform(results);
  console.log(transformed, 'transformed');

  // const keys = ["pk", "sectionId"];
  // updateItems(`${dynamoPrefix}-section`, items, keys)
  return results;
  // eslint-disable-next-line no-console
//   console.log("Completed data fix");
}

async function transform(items) {
    const transformed = items.map((item) => {
      item.contents.section.subsections.parts.questions[2].questions[7].fieldset_info.headers.contents[0] = "";
      item.contents.section.subsections.parts.questions[0].questions[7].fieldset_info.headers.contents[1] = "FFY 2022";
      item.contents.section.subsections.parts.questions[0].questions[7].fieldset_info.headers.contents[2] = "FFY 2023";
      item.contents.section.subsections.parts.questions[0].questions[7].fieldset_info.headers.contents[3] = "FFY 2024";
      // item.contents.section.subsections.parts.questions.questions.fieldset_info.rows.targets.lookupFmapFy[0] = "2022";
      // item.contents.section.subsections.parts.questions.questions.fieldset_info.rows.targets.lookupFmapFy[1] = "2023";
      // item.contents.section.subsections.parts.questions.questions.fieldset_info.rows.targets.lookupFmapFy[2] = "2024";

    });
    
    return transformed;
}

async function scan(dynamoClient) {
  let startingKey;
  let existingItems = [];
  let results;

  const queryParams = {
    TableName: `${dynamoPrefix}-section`,
    ExpressionAttributeNames: {
        "#year": "year",
        "#sectionId": "sectionId",
      },
      ExpressionAttributeValues: {
        ":year": 2022,
        ":sectionId": 5,
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

exports.handler = myHandler;
