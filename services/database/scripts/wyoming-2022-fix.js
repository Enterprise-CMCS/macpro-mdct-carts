/* eslint-disable no-console */
const aws = require("aws-sdk");
const isLocal = !!process.env.DYNAMODB_URL;
const localEndpoint = process.env.DYNAMODB_URL;
const sectionTableName = isLocal
  ? "local-section"
  : process.env.dynamoPrefix + "-section";

async function handler() {
  try {
    console.debug("Start of data fix");

    const db = buildDynamoClient();

    console.debug("Updating Section 0");
    const section0 = await getSection(db, "WY-2022", 0);
    // Set program type to writeable
    section0.contents.section.subsections[0].parts[0].questions[1].answer.readonly = false;
    await putSectionContents(db, section0);

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

async function getSection(db, pk, sectionId) {
  const params = {
    TableName: sectionTableName,
    KeyConditionExpression: "pk = :pk AND sectionId = :sectionId",
    ExpressionAttributeValues: { ":pk": pk, ":sectionId": sectionId },
  };

  const result = await db.query(params).promise();
  return result.Items[0];
}

async function putSectionContents(db, section) {
  const params = {
    TableName: sectionTableName,
    Key: {
      pk: section.pk,
      sectionId: section.sectionId,
    },
    UpdateExpression: "SET #contents = :contents",
    ExpressionAttributeNames: { "#contents": "contents" },
    ExpressionAttributeValues: { ":contents": section.contents },
  };

  await db.update(params).promise();
}

handler();
