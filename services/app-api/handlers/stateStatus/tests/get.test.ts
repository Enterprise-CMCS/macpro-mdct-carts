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
  authenticateUser: jest.fn(),
}));

const signInAs = (user: object) =>
  (authenticateUser as jest.Mock).mockReturnValueOnce(user);

describe("Test Get State Status Handlers", () => {
  beforeEach(() => jest.clearAllMocks());

  test("fetching state status should return only a state user's state", async () => {
    signInAs({ role: AppRoles.STATE_USER, state: "AL" });
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
    signInAs({ role: AppRoles.CMS_USER });
    const event: APIGatewayProxyEvent = {
      ...testEvent,
    };

    const res = await getStateStatus(event, null);

    expect(res.statusCode).toBe(200);
    expect(dynamodbLib.scanSome).toHaveBeenCalledWith({
      TableName: undefined,
    });
  });

  test("a state user with no assigned state gets an empty list", async () => {
    signInAs({ role: AppRoles.STATE_USER });

    const res = await getStateStatus({ ...testEvent }, null);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual({ Items: [] });
    expect(dynamodbLib.scanSome).not.toHaveBeenCalled();
  });
});
