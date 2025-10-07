import dynamoLib, { awsConfig } from "../dynamodb-lib";
import {
  BatchWriteCommand,
  BatchWriteCommandInput,
  BatchWriteCommandOutput,
  DeleteCommand,
  DynamoDBDocumentClient,
  QueryCommand,
  ScanCommand,
  ScanCommandInput,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

const dynamoClientMock = mockClient(DynamoDBDocumentClient);

describe("DynamoDB Library", () => {
  beforeEach(() => {
    dynamoClientMock.reset();
  });

  test("Can query", async () => {
    const mockItem = { foo: "bar" };
    dynamoClientMock.on(QueryCommand).resolves({
      Items: [mockItem],
    });

    const foos = await dynamoLib.query({ TableName: "foos" });

    expect(foos.Items?.[0]).toBe(mockItem);
  });

  test("Can update", async () => {
    const mockUpdate = jest.fn();
    dynamoClientMock.on(UpdateCommand).callsFake(mockUpdate);

    await dynamoLib.update({ TableName: "foos", Key: { id: "fid" } });

    expect(mockUpdate).toHaveBeenCalled();
  });

  test("Can delete", async () => {
    const mockDelete = jest.fn();
    dynamoClientMock.on(DeleteCommand).callsFake(mockDelete);

    await dynamoLib.delete({ TableName: "foos", Key: { id: "fid" } });

    expect(mockDelete).toHaveBeenCalled();
  });

  test("Can scan some", async () => {
    const mockItem = { foo: "bar" };
    dynamoClientMock.on(ScanCommand).resolves({ Items: [mockItem] });

    const result = await dynamoLib.scanSome({ TableName: "foos" });

    expect(result.Items?.[0]).toBe(mockItem);
  });

  test("Can scan all", async () => {
    const mockKey = {};
    const mockItem1 = { foo: "bar" };
    const mockItem2 = { foo: "baz" };
    const extraCall = jest.fn();
    dynamoClientMock
      .on(ScanCommand)
      .resolvesOnce({ Items: [mockItem1], LastEvaluatedKey: mockKey })
      .callsFakeOnce((command: ScanCommandInput) => {
        expect(command.ExclusiveStartKey).toBe(mockKey);
        return Promise.resolve({ Items: [mockItem2] });
      })
      .callsFake(extraCall);

    const result = await dynamoLib.scanAll({ TableName: "foos" });

    expect(result).toHaveLength(2);
    expect(result[0]).toBe(mockItem1);
    expect(result[1]).toBe(mockItem2);
    expect(extraCall).not.toHaveBeenCalled();
  });

  test("Can process a complete batch write", async () => {
    const mockBatchWrite = jest.fn(() => ({}));
    dynamoClientMock.on(BatchWriteCommand).callsFake(mockBatchWrite);

    const input = {
      RequestItems: {
        foos: [
          {
            PutRequest: {
              Item: { foo: "bar" },
            },
          },
        ],
      },
    };
    await dynamoLib.batchWriteItem(input);

    expect(mockBatchWrite).toHaveBeenCalled();
  });

  test("Throws an error for a failed batch write", async () => {
    const fooPut1 = { PutRequest: { Item: { id: "foo 1" } } };
    const barPut1 = { PutRequest: { Item: { id: "bar 1" } } };
    const barPut2 = { PutRequest: { Item: { id: "bar 1" } } };
    const bazDelete1 = { DeleteRequest: { Key: { id: "baz 1" } } };
    const bazDelete2 = { DeleteRequest: { Key: { id: "baz 1" } } };
    const mockInput: BatchWriteCommandInput = {
      RequestItems: {
        foos: [fooPut1],
        bars: [barPut1, barPut2],
        bazs: [bazDelete1, bazDelete2],
      },
    };
    const mockOutput: BatchWriteCommandOutput = {
      UnprocessedItems: {
        foos: [],
        bars: [barPut1],
        bazs: [bazDelete1, bazDelete2],
      },
      $metadata: {},
    };
    const expectedMessage =
      "Some items in the batch request were not processed:\n" +
      "  bars: 1 (of 2) requests failed\n" +
      "  bazs: 2 (of 2) requests failed";
    dynamoClientMock.on(BatchWriteCommand).resolves(mockOutput);

    try {
      await dynamoLib.batchWriteItem(mockInput);
      throw new Error("batchWriteItem should not have succeeded");
    } catch (err: any) {
      expect(err).toHaveProperty("message", expectedMessage);
    }
  });

  test("Uses AWS config", () => {
    const config = awsConfig;
    expect(config).toHaveProperty("region", "us-east-1");
  });
});
