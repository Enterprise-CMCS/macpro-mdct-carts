import { updateStateStatus } from "../update";
import { testEvent } from "../../../test-util/testEvents";
import { AppRoles, APIGatewayProxyEvent } from "../../../types";
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
    role: AppRoles.CMS_USER,
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

    /*
     * Convert date to a regex that doesn't care about seconds.
     * For example "12:34:56 (UTC)" becomes /12:34:.. \(UTC\)/
     * This reduces flakiness, in case a second passes during text execution
     */
    const expectedDateString = new Date()
      .toString()
      .replace("(", "\\(")
      .replace(")", "\\)")
      .replace(/(?<=\d{2}:\d{2}:)\d{2}/, "..");

    expect(res.statusCode).toBe(200);
    expect(dynamodbLib.update).toBeCalledWith({
      ExpressionAttributeNames: {
        "#lastChanged": "lastChanged",
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":status": "in_progress",
        ":lastChanged": expect.stringMatching(expectedDateString),
      },
      Key: {
        stateId: "AL",
        year: 2021,
      },
      UpdateExpression: "set #status=:status, #lastChanged=:lastChanged",
      TableName: undefined,
    });
  });
});
