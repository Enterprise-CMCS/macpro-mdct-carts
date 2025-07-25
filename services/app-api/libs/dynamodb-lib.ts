import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  BatchWriteCommand,
  BatchWriteCommandInput,
  BatchWriteCommandOutput,
  DeleteCommand,
  DeleteCommandInput,
  DynamoDBDocumentClient,
  QueryCommand,
  QueryCommandInput,
  ScanCommand,
  ScanCommandInput,
  UpdateCommand,
  UpdateCommandInput,
} from "@aws-sdk/lib-dynamodb";
import {
  Measure,
  State,
  StateStatus,
  Section,
  AcsData,
  FmapData,
} from "../types";
import { logger } from "./debug-lib";

export const getConfig = () => {
  return {
    region: "us-east-1",
    logger,
    endpoint: process.env.AWS_ENDPOINT_URL,
  };
};

const client = DynamoDBDocumentClient.from(new DynamoDBClient(getConfig()));

/** An exhaustive list of all types of objects stored in DynamoDB for CARTS */
export type CartsDynamoTableType =
  | StateStatus
  | Section
  | Measure
  | State
  | AcsData
  | FmapData
  | State;

const batchRequestHadAnyFailures = (result: BatchWriteCommandOutput) => {
  if (!result.UnprocessedItems) {
    return false;
  }

  return Object.values(result.UnprocessedItems).some(
    (failureList) => failureList.length > 0
  );
};

const buildBatchRequestErrorMessage = (
  params: BatchWriteCommandInput,
  result: BatchWriteCommandOutput
) => {
  let errorMessage = "Some items in the batch request were not processed:";

  for (let [tableName, failedRequests] of Object.entries(
    result.UnprocessedItems!
  )) {
    if (failedRequests.length === 0) {
      continue;
    }

    let failedCount = failedRequests.length;
    let attemptedCount = params.RequestItems![tableName].length;

    errorMessage += `\n  ${tableName}: ${failedCount} (of ${attemptedCount}) requests failed`;
  }

  return errorMessage;
};

export default {
  batchWriteItem: async (params: BatchWriteCommandInput) => {
    const result = await client.send(new BatchWriteCommand(params));

    if (batchRequestHadAnyFailures(result)) {
      throw new Error(buildBatchRequestErrorMessage(params, result));
    }

    return result;
  },
  /**
   * This method should be abandoned as soon as possible in favor of scanAll;
   * a truncated result with a continuation key is almost never what we want.
   */
  scanSome: async <Result = CartsDynamoTableType>(params: ScanCommandInput) => {
    const result = await client.send(new ScanCommand(params));
    return { ...result, Items: result?.Items as Result[] | undefined };
  },
  scanAll: async <Result = CartsDynamoTableType>(
    params: Omit<ScanCommandInput, "ExclusiveStartKey">
  ) => {
    let items: Result[] = [];
    let ExclusiveStartKey: any;

    do {
      const command = new ScanCommand({ ...params, ExclusiveStartKey });
      const result = await client.send(command);
      items = items.concat((result.Items as Result[]) ?? []);
      ExclusiveStartKey = result.LastEvaluatedKey;
    } while (ExclusiveStartKey);

    return items;
  },
  update: (params: UpdateCommandInput) =>
    client.send(new UpdateCommand(params)),
  delete: (params: DeleteCommandInput) =>
    client.send(new DeleteCommand(params)),
  query: (params: QueryCommandInput) => client.send(new QueryCommand(params)),
};
