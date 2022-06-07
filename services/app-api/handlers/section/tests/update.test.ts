/* eslint-disable no-console */
import { updateSections } from "../update";
import dbLib from "../../../libs/dynamodb-lib";
import { APIGatewayProxyEvent } from "aws-lambda"; // eslint-disable-line no-unused-vars
import { testEvent } from "../../../test-util/testEvents";
import { convertToDynamoExpression } from "../../dynamoUtils/convertToDynamoExpressionVars";
import { UserRoles } from "../../../types";

const originalError = console.error; // cache to restore, we're testing an error
jest.mock("../../../libs/dynamodb-lib", () => ({
  __esModule: true,
  default: {
    update: jest.fn(),
    query: jest.fn().mockReturnValue({ Items: [{ status: "not_started" }] }),
  },
}));

jest.mock("../../../libs/authorization", () => ({
  __esModule: true,
  isAuthorized: jest.fn().mockReturnValue(true),
  getUserCredentialsFromJwt: jest.fn().mockReturnValue({
    role: UserRoles.STATE,
    state: "AL",
  }),
}));

jest.mock("../../dynamoUtils/convertToDynamoExpressionVars", () => ({
  __esModule: true,
  convertToDynamoExpression: jest.fn(),
}));

describe("Test Update Sections Handler", () => {
  beforeEach(() => {
    console.error = jest.fn();
  });
  afterEach(() => {
    console.error = originalError;
  });

  test("sections should batch update and update state status if not started", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      body: `[{"pk": "AL-2022", "sectionId": 0, "contents": {"test": "test"}, "year": 2022, "stateId": "AL"}]`,
      pathParameters: { year: "2022", state: "AL" },
    };

    const res = await updateSections(event, null);

    expect(res.statusCode).toBe(200);
    expect(convertToDynamoExpression).toHaveBeenNthCalledWith(
      1,
      {
        contents: { test: "test" },
      },
      "post"
    );
    expect(dbLib.update).toHaveBeenCalledWith({
      Key: {
        pk: "AL-2022",
        sectionId: 0,
      },
    });
    expect(dbLib.query).toHaveBeenCalledWith({
      KeyConditionExpression:
        "stateId = :stateId AND #currentYear = :currentYear",
      ExpressionAttributeValues: {
        ":stateId": "AL",
        ":currentYear": 2022,
      },
      ExpressionAttributeNames: {
        "#currentYear": "year",
      },
    });
    expect(convertToDynamoExpression).toHaveBeenNthCalledWith(
      2,
      {
        status: "in_progress",
        lastChanged: new Date().toString(),
      },
      "post"
    );
  });

  test("updating sections without state and year throws error", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: {},
    };

    const res = await updateSections(event, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toBe(
      '{"error":"Be sure to include state, year in the path"}'
    );
  });
});
