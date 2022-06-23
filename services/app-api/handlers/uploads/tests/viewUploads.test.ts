import { viewUploaded } from "../viewUploaded";
import dbLib from "../../../libs/dynamodb-lib";
import { APIGatewayProxyEvent } from "aws-lambda"; // eslint-disable-line no-unused-vars
import { testEvent } from "../../../test-util/testEvents";
import { AppRoles } from "../../../types";

jest.mock("../../../libs/dynamodb-lib", () => ({
  __esModule: true,
  default: {
    query: jest.fn().mockReturnValue({
      Items: [
        {
          awsFilename: "aws_abc123.png",
          filename: "abc123.png",
        },
        {
          awsFilename: "aws_def456.png",
          filename: "def456.png",
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
    email: "james_holden@test.com",
  }),
}));

jest.mock("../../dynamoUtils/convertToDynamoExpressionVars", () => ({
  __esModule: true,
  convertToDynamoExpression: jest.fn(),
}));

describe("Test Create Upload Handler", () => {
  test("Should call to dynamo for the requested question", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      body: `{"questionId": "question-1234"}`,
      pathParameters: { year: "2022", state: "AL" },
    };

    const res = await viewUploaded(event, null);

    expect(res.statusCode).toBe(200);
    expect(dbLib.query).toHaveBeenCalledWith(
      expect.objectContaining({
        ExpressionAttributeValues: {
          ":uploadedState": "AL",
          ":fileId": `2022-question-1234`,
        },
      })
    );
    expect(JSON.parse(res.body)).toHaveLength(2);
  });
});
