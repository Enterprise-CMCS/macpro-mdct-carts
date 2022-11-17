/* eslint-disable no-console */
import dbLib from "../../../libs/dynamodb-lib";
import { APIGatewayProxyEvent } from "aws-lambda"; // eslint-disable-line no-unused-vars
import { testEvent } from "../../../test-util/testEvents";
import { AppRoles } from "../../../types";
import { getEnrollmentCounts } from "../get";

const originalError = console.error; // cache to restore, we're testing an error
jest.mock("../../../libs/dynamodb-lib", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    query: jest.fn().mockReturnValue({
      Items: [
        {
          pk: "AL-2022",
          entryKey: "separate_chip-1",
          indexToUpdate: 1,
          stateId: "AL",
          typeOfEnrollment: "Separate CHIP",
          enrollmentCount: 5,
          filterId: "2022-02",
          yearToModify: "2022",
        },
        {
          pk: "AL-2021",
          entryKey: "separate_chip-2",
          indexToUpdate: 2,
          stateId: "AL",
          typeOfEnrollment: "Separate CHIP",
          enrollmentCount: 5,
          filterId: "2021-02",
          yearToModify: "2021",
        },
      ],
    }),
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

describe("Test Get Enrollment Count Handlers", () => {
  beforeEach(() => {
    console.error = jest.fn();
  });
  afterEach(() => {
    console.error = originalError;
  });

  test("fetching enrollment counts should use state and year", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { year: "2022", state: "AL" },
    };

    const res = await getEnrollmentCounts(event, null);

    expect(res.statusCode).toBe(200);
    expect(dbLib.query).toHaveBeenCalledWith({
      KeyConditionExpression: "pk = :pk",
      ExpressionAttributeValues: {
        ":pk": "AL-2022",
      },
    });
    const body = JSON.parse(res.body);
    expect(body.length).toEqual(4); // get should be called 2x to populate
  });

  test("fetching enrollment counts without state and year throws error", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: {},
    };

    const res = await getEnrollmentCounts(event, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toBe(
      '{"error":"Be sure to include state, year in the path"}'
    );
  });

  test("state users should not get results for other states", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { year: "2022", state: "CO" },
    };

    const res = await getEnrollmentCounts(event, null);
    expect(res.body).toBe("[]");
  });
});
