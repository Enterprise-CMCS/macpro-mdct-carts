/* eslint-disable no-console */
import { updateStateStatus } from "../update";
import { APIGatewayProxyEvent } from "aws-lambda"; // eslint-disable-line no-unused-vars
import { testEvent } from "../../../test-util/testEvents";
import { UserRoles } from "../../../types";
import dynamodbLib from "../../../libs/dynamodb-lib";

const originalError = console.error; // cache to restore, we're testing an error
jest.mock("../../../libs/dynamodb-lib", () => ({
  __esModule: true,
  default: {
    update: jest.fn(),
  },
}));

jest.mock("../../../libs/authorization", () => ({
  isAuthorized: jest.fn().mockReturnValue(true),
  getUserCredentialsFromJwt: jest.fn().mockReturnValue({
    role: UserRoles.STATE,
    state: "AL",
  }),
}));

describe("Test Update State Status Handlers", () => {
  beforeEach(() => {
    console.error = jest.fn();
  });
  afterEach(() => {
    console.error = originalError;
  });
  test("update state status without year and state", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: {},
      body: `{"status": "certified", "username": "test user"}`,
    };

    const res = await updateStateStatus(event, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toBe(
      '{"error":"Be sure to include state, year in the path"}'
    );
  });

  test("update state status without new status", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { year: "2022", state: "AL" },
      body: `{"username": "test user"}`,
    };

    const res = await updateStateStatus(event, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toBe(
      '{"error":"Cannot update State Status without a new status and username"}'
    );
  });

  test("update state status as a state user uses correct query", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { year: "2022", state: "AL" },
      body: `{"status": "certified", "username": "test user"}`,
    };

    const res = await updateStateStatus(event, null);

    expect(res.statusCode).toBe(200);
    expect(dynamodbLib.update).toBeCalledWith({
      ExpressionAttributeNames: {
        "#lastChanged": "lastChanged",
        "#status": "status",
        "#username": "username",
      },
      ExpressionAttributeValues: {
        ":status": "certified",
        ":username": "test user",
        ":lastChanged": new Date().toString(),
      },
      Key: {
        stateId: "AL",
        year: 2022,
      },
      UpdateExpression:
        "set #status=:status, #username=:username, #lastChanged=:lastChanged",
      TableName: undefined,
    });
  });
});
