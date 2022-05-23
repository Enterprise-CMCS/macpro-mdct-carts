import { updateStateStatus } from "../update";
import { APIGatewayProxyEvent } from "aws-lambda"; // eslint-disable-line no-unused-vars
import { testEvent } from "../../../test-util/testEvents";
import { UserRoles } from "../../../types";
import dynamodbLib from "../../../libs/dynamodb-lib";

jest.mock("../../../libs/dynamodb-lib", () => ({
  __esModule: true,
  default: {
    update: jest.fn(),
  },
}));

jest.mock("../../../libs/authorization", () => ({
  isAuthorized: jest.fn().mockReturnValue(true),
  getUserCredentialsFromJwt: jest.fn().mockReturnValue({
    role: UserRoles.ADMIN,
    state: "AL",
  }),
}));
describe("Test Uncertify CARTS Report Handler", () => {
  test("uncertify CARTS report", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { year: "2021", state: "AL" },
      body: `{"status": "in_progress", "username": "test user"}`,
    };
    const res = await updateStateStatus(event, null);
    expect(res.statusCode).toBe(200);
    expect(dynamodbLib.update).toBeCalledWith({
      ExpressionAttributeNames: {
        "#lastChanged": "lastChanged",
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":status": "in_progress",
        ":lastChanged": new Date().toString(),
      },
      Key: {
        stateId: "AL",
        year: 2021,
      },
      UpdateExpression:
        "set #status=:status, #lastChanged=:lastChanged",
      TableName: undefined,
    });
  });
});
