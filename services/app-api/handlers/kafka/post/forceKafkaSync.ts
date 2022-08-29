/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import handler from "../../../libs/handler-lib";
import dynamoDb from "../../../libs/dynamodb-lib";
import chunk from "lodash/chunk";

/**
 * Handler for forcing all items in the database into kafka.
 * Setup as a manual trigger only (no http trigger or events)
 * When, updates the lastSynced in each item.
 *
 * This is a helper function primarily for the situation where an environment is deployed,
 * has existing data, and that existing data needs to be present in the kafka message history.
 *
 * Should only be run in the above situation as scanning everything is an expensive operation
 *
 * Functionality and pattern borrowed from cms-mdct-seds repo
 */

// Outbound tables to kafka for consumption by DataConnect
const tableNames = [
  process.env.stateStatusTableName!,
  process.env.sectionTableName!,
];

const scanTable = async (
  tableName: string,
  startingKey: any,
  keepSearching: boolean
) => {
  let results = await dynamoDb.scan({
    TableName: tableName,
    ExclusiveStartKey: startingKey,
  });
  if (results.LastEvaluatedKey) {
    startingKey = results.LastEvaluatedKey;
    return [startingKey, keepSearching, results];
  } else {
    keepSearching = false;
    return [null, keepSearching, results];
  }
};

const mergeLastSynced = (items: any[], syncDateTime: string) =>
  items.map((item) => ({ ...item, lastSynced: syncDateTime }));

const batchWrite = async (tableName: string, items: any[]) => {
  console.log(
    `Performing batchwrite for ${items.length} items in table: ${tableName}`
  );
  // split items into chunks of 25
  const itemChunks = chunk(items, 25);
  console.log(
    `Items split into ${itemChunks.length} chunk(s) of not more than 25 items`
  );
  for (const index in itemChunks) {
    // Construct the request params for batchWrite
    const itemArray = itemChunks[index].map((item) => {
      return {
        PutRequest: {
          Item: item,
        },
      };
    });

    let requestItems: any = {};
    requestItems[tableName] = itemArray;

    const params = {
      RequestItems: requestItems,
    };

    const results: any = await dynamoDb.batchWriteItem(params);
    const { FailedItems } = results;
    console.log(`BatchWrite performed for ${itemArray.length} items`);
    if ((FailedItems?.length ?? 0) > 0) {
      const keys = FailedItems.map((item: any) => item[Object.keys(item)[0]]);
      console.log(
        `BatchWrite ran with ${
          FailedItems.length ?? 0
        } numbers of failed item updates`
      );
      console.log(
        `The following items failed updating for the table ${tableName} -  keys ${keys}`
      );
    }
  }
};

export const main = handler(async (event, context) => {
  const syncDateTime = new Date().toISOString();

  for (const tableName of tableNames) {
    console.log(`Starting to scan table ${tableName}`);
    let startingKey;

    let keepSearching = true;
    // Looping to perform complete scan of tables due to 1 mb limit per iteration
    while (keepSearching) {
      let data;

      try {
        [startingKey, keepSearching, data] = await scanTable(
          tableName,
          startingKey,
          keepSearching
        );
      } catch (err) {
        console.error(`Database scan failed for the table ${tableName}
                     with startingKey ${startingKey} and the keepSearching flag is ${keepSearching}.
                     Error: ${err}`);
        throw err;
      }

      // Add lastSynced date time field
      const updatedItems = mergeLastSynced(data.Items, syncDateTime);
      try {
        await batchWrite(tableName, updatedItems);
      } catch (e) {
        console.error(`BatchWrite failed with exception ${e}`);
        throw e;
      }
    }
  }
});
