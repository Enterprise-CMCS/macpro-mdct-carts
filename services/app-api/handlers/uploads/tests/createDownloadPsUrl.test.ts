import { getSignedFileUrl } from "../createDownloadPsUrl";
import dbLib from "../../../libs/dynamodb-lib";
import s3Lib from "../../../libs/s3-lib";
import { testEvent } from "../../../test-util/testEvents";
import { AppRoles, APIGatewayProxyEvent } from "../../../types";

jest.mock("../../../libs/dynamodb-lib", () => ({
  __esModule: true,
  default: {
    query: jest.fn().mockReturnValue({
      Items: [
        {
          awsFilename: "aws_abc123.png",
          filename: "abc123.png",
        },
      ],
    }),
    delete: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock("../../../libs/s3-lib", () => ({
  __esModule: true,
  default: {
    getSignedUrl: jest.fn().mockReturnValue({
      url: "http://google.com",
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

describe("Test Create Download Handler", () => {
  test("Should request a presigned url for a given fileId", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      body: `{"fileId": "id_abc123.png"}`,
      pathParameters: { year: "2022", state: "AL" },
    };

    const res = await getSignedFileUrl(event, null);

    expect(res.statusCode).toBe(200);
    expect(dbLib.query).toHaveBeenCalledWith(
      expect.objectContaining({
        KeyConditionExpression:
          "uploadedState = :uploadedState AND fileId = :fileId",
        ExpressionAttributeValues: {
          ":uploadedState": "AL",
          ":fileId": "id_abc123.png",
        },
      })
    );
    expect(s3Lib.getSignedUrl).toHaveBeenCalledWith(
      "getObject",
      expect.objectContaining({
        Key: "aws_abc123.png",
        ResponseContentDisposition: `attachment; filename = abc123.png`,
        Expires: 3600,
      })
    );
  });
});
