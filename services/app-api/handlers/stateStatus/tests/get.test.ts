import { getStateStatus } from "../get";
import { testEvent } from "../../../test-util/testEvents";
import { AppRoles, APIGatewayProxyEvent } from "../../../types";
import dynamodbLib from "../../../libs/dynamodb-lib";
import { authenticateUser } from "../../../libs/authorization";

jest.mock("../../../libs/dynamodb-lib", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    scanSome: jest.fn(),
  },
}));

jest.mock("../../../libs/authorization", () => ({
  isAuthorized: jest.fn().mockReturnValue(true),
  authenticateUser: jest
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
    expect(dynamodbLib.scanSome).toHaveBeenCalledWith({
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
    expect(dynamodbLib.scanSome).toHaveBeenCalledWith({
      TableName: undefined,
    });
  });

  test("a state user with no assigned state gets an empty list in the usual shape", async () => {
    (authenticateUser as jest.Mock).mockReturnValueOnce({
      role: AppRoles.STATE_USER,
    });
    (dynamodbLib.scanSome as jest.Mock).mockClear();

    const res = await getStateStatus({ ...testEvent }, null);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual({ Items: [] });
    expect(dynamodbLib.scanSome).not.toHaveBeenCalled();
  });
});
