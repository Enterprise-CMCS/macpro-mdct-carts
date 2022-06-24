/* eslint-disable no-console */
import { getSections } from "../get";
import dbLib from "../../../libs/dynamodb-lib";
import { APIGatewayProxyEvent } from "aws-lambda"; // eslint-disable-line no-unused-vars
import { testEvent } from "../../../test-util/testEvents";
import { AppRoles } from "../../../types";

const originalError = console.error; // cache to restore, we're testing an error
jest.mock("../../../libs/dynamodb-lib", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    query: jest.fn().mockReturnValue({ Items: [] }),
  },
}));

jest.mock("../../../libs/authorization", () => ({
  __esModule: true,
  isAuthorized: jest.fn().mockReturnValue(true),
  getUserCredentialsFromJwt: jest.fn().mockReturnValue({
    role: AppRoles.STATE_USER,
    state: "AL",
  }),
}));

jest.mock("../../dynamoUtils/convertToDynamoExpressionVars", () => ({
  __esModule: true,
  convertToDynamoExpression: jest.fn(),
}));

describe("Test Get Sections Handlers", () => {
  beforeEach(() => {
    console.error = jest.fn();
  });
  afterEach(() => {
    console.error = originalError;
  });

  test("fetching sections should use state and year", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { year: "2022", state: "AL" },
    };

    const res = await getSections(event, null);

    expect(res.statusCode).toBe(200);
    expect(dbLib.query).toHaveBeenCalledWith({
      KeyConditionExpression: "pk = :pk",
      ExpressionAttributeValues: {
        ":pk": "AL-2022",
      },
    });
  });

  test("fetching sections without state and year throws error", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: {},
    };

    const res = await getSections(event, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toBe(
      '{"error":"Be sure to include state, year in the path"}'
    );
  });
});
