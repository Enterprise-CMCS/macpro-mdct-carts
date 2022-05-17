import { uncertifyReport } from "../uncertify";
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
    //   TODO: update this role from ADMIN to APPROVER
    role: UserRoles.ADMIN,
    state: "AL",
  }),
}));

describe("Test Uncertify Report Handlers", () => {
  test("uncertify CARTS report", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { year: "2021", state: "AL" },
      body: `{"status": "in_progress", "username": "test user"}`,
    };

    const res = await uncertifyReport(event, null);

    expect(res.statusCode).toBe(200);
    expect(dynamodbLib.update).toBeCalledWith({
      ExpressionAttributeNames: {
        "#lastChanged": "lastChanged",
        "#status": "status",
        "#username": "username",
      },
      ExpressionAttributeValues: {
        ":status": "in_progress",
        ":username": "test user",
        ":lastChanged": new Date().toString(),
      },
      Key: {
        stateId: "AL",
        year: 2021,
      },
      UpdateExpression:
        "set #username=:username, #lastChanged=:lastChanged, #status=:status",
      TableName: undefined,
    });
  });
});
