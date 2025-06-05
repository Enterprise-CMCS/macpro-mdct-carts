import { deleteUpload } from "../delete";
import dbLib from "../../../libs/dynamodb-lib";
import s3Lib from "../../../libs/s3-lib";
import { testEvent } from "../../../test-util/testEvents";
import { AppRoles, APIGatewayProxyEvent } from "../../../types";

jest.mock("../../../libs/dynamodb-lib", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    delete: jest.fn(),
    query: jest.fn().mockReturnValue({
      Items: [{ awsFilename: "myFilename.png", fileId: "uniqueIdString" }],
    }),
  },
}));

jest.mock("../../../libs/s3-lib", () => ({
  __esModule: true,
  default: {
    deleteObject: jest.fn(),
    createPresignedPost: jest.fn(),
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

describe("Test Delete Upload Handler", () => {
  test("Should Call S3 delete when entry exists", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { year: "2022", state: "AL", fileId: "uniqueIdString" },
    };
    process.env.uploadS3BucketName = "fakeBucket";

    const res = await deleteUpload(event, null);

    expect(res.statusCode).toBe(200);
    expect(dbLib.query).toHaveBeenCalledWith({
      KeyConditionExpression:
        "uploadedState = :uploadedState AND fileId = :fileId",
      ExpressionAttributeValues: {
        ":uploadedState": "AL",
        ":fileId": "uniqueIdString",
      },
    });
    expect(s3Lib.deleteObject).toHaveBeenCalledWith({
      Bucket: "fakeBucket",
      Key: "myFilename.png",
    });
    expect(dbLib.delete).toHaveBeenCalledWith({
      Key: {
        uploadedState: "AL",
        fileId: "uniqueIdString",
      },
    });
  });
});
