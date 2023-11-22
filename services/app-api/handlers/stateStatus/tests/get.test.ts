import { getStateStatus } from "../get";
import { testEvent } from "../../../test-util/testEvents";
import { AppRoles, APIGatewayProxyEvent } from "../../../types";
import dynamodbLib from "../../../libs/dynamodb-lib";

jest.mock("../../../libs/dynamodb-lib", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    scanSome: jest.fn(),
  },
}));

jest.mock("../../../libs/authorization", () => ({
  isAuthorized: jest.fn().mockReturnValue(true),
  getUserCredentialsFromJwt: jest
    .fn()
    .mockReturnValueOnce({
      role: AppRoles.STATE_USER,
      state: "AL",
    })
    .mockReturnValueOnce({
      role: AppRoles.CMS_USER,
    }),
}));

describe("Test Get State Status Handlers", () => {
  test("fetching state status should return only a state user's state", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
    };

    const res = await getStateStatus(event, null);

    expect(res.statusCode).toBe(200);
    expect(dynamodbLib.scanSome).toBeCalledWith({
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

  test("fetching state status should return everything for business owner rep", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
    };

    const res = await getStateStatus(event, null);

    expect(res.statusCode).toBe(200);
    expect(dynamodbLib.scanSome).toBeCalledWith({
      TableName: undefined,
    });
  });
});
