/* eslint-disable no-console */
/*
 * Local:
 *    `DYNAMODB_URL="http://localhost:8000" dynamoPrefix="local" node services/database/scripts/sync-kafka-2024.js`
 *  Branch:
 *    dynamoPrefix="YOUR BRANCH NAME" node services/database/scripts/sync-kafka-2024.js
 */

const { buildDynamoClient, scan, update } = require("./utils/dynamodb.js");

const isLocal = !!process.env.DYNAMODB_URL;

const sectionTableName = isLocal
  ? "local-section"
  : process.env.dynamoPrefix + "-section";
const statusTableName = isLocal
  ? "local-state-status"
  : process.env.dynamoPrefix + "-state-status";
const tables = [sectionTableName, statusTableName];
const syncTime = new Date().toISOString();

async function handler() {
  try {
    console.log("Searching for 2024 modifications");

    buildDynamoClient();

    for (const tableName of tables) {
      console.log(`Processing table ${tableName}`);
      const existingItems = await scan({
        TableName: tableName,
      });
      const filteredItems = filter(existingItems);
      const transformedItems = await transform(filteredItems);
      await update(tableName, transformedItems);
      console.log(`Touched ${transformedItems.length} in table ${tableName}`);
    }
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

function filter(items) {
  return items.filter(
    (item) => new Date(item.lastChanged).getFullYear() === 2024
  );
}

async function transform(items) {
  // Touch sync field only
  const transformed = items.map((item) => {
    const corrected = { ...item, ...{ lastSynced: syncTime } };
    return corrected;
  });

  return transformed;
}

handler();
