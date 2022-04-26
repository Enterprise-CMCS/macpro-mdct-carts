import { getSections } from "../get";
import dbLib from "../../../libs/dynamodb-lib";
import { APIGatewayProxyEvent } from "aws-lambda"; // eslint-disable-line no-unused-vars
import { testEvent } from "../../../test-util/testEvents";
import { convertToDynamoExpression } from "../../dynamoUtils/convertToDynamoExpressionVars";

jest.mock("../../../libs/dynamodb-lib", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    scan: jest.fn(),
  },
}));

jest.mock("../../../libs/authorization", () => ({
  __esModule: true,
  isAuthorized: jest.fn().mockReturnValue(true),
}));

jest.mock("../../dynamoUtils/convertToDynamoExpressionVars", () => ({
  __esModule: true,
  convertToDynamoExpression: jest.fn(),
}));

describe("Test Get Sections Handlers", () => {
  test("fetching sections should use state and year", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { year: "2022", state: "AL" },
    };

    const res = await getSections(event, null);

    expect(res.statusCode).toBe(200);
    expect(convertToDynamoExpression).toHaveBeenCalledWith(
      { stateId: "AL", year: 2022 },
      "list"
    );
  });
});
