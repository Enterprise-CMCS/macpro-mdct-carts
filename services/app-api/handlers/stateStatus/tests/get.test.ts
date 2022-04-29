import { getStateStatus } from "../get";
import dbLib from "../../../libs/dynamodb-lib";
import { APIGatewayProxyEvent } from "aws-lambda"; // eslint-disable-line no-unused-vars
import { testEvent } from "../../../test-util/testEvents";
import { UserRoles } from "../../../types";
import dynamodbLib from "../../../libs/dynamodb-lib";

jest.mock("../../../libs/dynamodb-lib", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    scan: jest.fn(),
  },
}));

jest.mock("../../../libs/authorization", () => ({
  isAuthorized: jest.fn().mockReturnValue(true),
  getUserCredentialsFromJwt: jest
    .fn()
    .mockReturnValueOnce({
      role: UserRoles.STATE,
      state: "AL",
    })
    .mockReturnValueOnce({
      role: UserRoles.ADMIN,
    }),
}));

describe("Test Get State Status Handlers", () => {
  test("fetching state status should return only a state user's state", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
    };

    const res = await getStateStatus(event, null);

    expect(res.statusCode).toBe(200);
    expect(dynamodbLib.scan).toBeCalledWith({
      ExpressionAttributeNames: {
        "#stateId": "stateId",
      },
      ExpressionAttributeValues: {
        ":stateId": "AL",
      },
      FilterExpression: "#stateId = :stateId",
      TableName: undefined,
    });
  });

  test("fetching state status should return everything for admin user", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
    };

    const res = await getStateStatus(event, null);

    expect(res.statusCode).toBe(200);
    expect(dynamodbLib.scan).toBeCalledWith({
      TableName: undefined,
    });
  });
});
