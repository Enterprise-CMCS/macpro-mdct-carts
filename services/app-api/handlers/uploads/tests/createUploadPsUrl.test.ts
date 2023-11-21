import { psUpload } from "../createUploadPsUrl";
import dbLib from "../../../libs/dynamodb-lib";
import s3Lib from "../../../libs/s3-lib";
import { testEvent } from "../../../test-util/testEvents";
import { AppRoles, APIGatewayProxyEvent } from "../../../types";

jest.mock("../../../libs/dynamodb-lib", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock("../../../libs/s3-lib", () => ({
  __esModule: true,
  default: {
    getSignedUrl: jest.fn(),
    deleteObject: jest.fn(),
    createPresignedPost: jest.fn().mockReturnValue({
      url: "http://google.com",
      fields: "{Headers:{'key':'value'}}",
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
  test("Should add call to add an entry to dynamo and s3", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      body: `{"uploadedFileName": "myFilename.png", "questionId": "abc123"}`,
      pathParameters: { year: "2022", state: "AL" },
    };

    const res = await psUpload(event, null);

    expect(res.statusCode).toBe(200);
    expect(dbLib.update).toHaveBeenCalled();
    expect(s3Lib.createPresignedPost).toHaveBeenCalled();
  });
});
