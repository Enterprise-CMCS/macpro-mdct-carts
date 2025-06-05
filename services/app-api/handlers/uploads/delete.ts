import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { getUserCredentialsFromJwt } from "../../libs/authorization";
import { AppRoles } from "../../types";
import s3 from "../../libs/s3-lib";
import { UnauthorizedError } from "../../libs/httpErrors";

/**
 * Returns the report Sections associated with a given year and state
 */
export const deleteUpload = handler(async (event, _context) => {
  const user = getUserCredentialsFromJwt(event);
  const state = event.pathParameters ? event.pathParameters["state"] : "";
  const fileId = event.pathParameters ? event.pathParameters["fileId"] : "";

  if (user.role !== AppRoles.STATE_USER || !fileId || !state) {
    throw new UnauthorizedError("Unauthorized");
  }

  const decodedFileId = decodeURIComponent(fileId);
  // Get file, check aws filename before deleting
  const documentParams = {
    TableName: process.env.UploadsTableName!,
    KeyConditionExpression:
      "uploadedState = :uploadedState AND fileId = :fileId",
    ExpressionAttributeValues: {
      ":uploadedState": state,
      ":fileId": decodedFileId,
    },
  };
  const results = await dynamoDb.query(documentParams);
  if (!results.Items || results.Items.length === 0) {
    throw new Error("Unauthorized");
  }
  const document = results.Items[0];

  // DELETE AWS
  var params = {
    Bucket: process.env.uploadS3BucketName,
    Key: document.awsFilename,
  };
  await s3.deleteObject(params);

  // DELETE Dynamo entry
  const deleteParams = {
    TableName: process.env.UploadsTableName!,
    Key: {
      uploadedState: state,
      fileId: decodedFileId,
    },
  };

  await dynamoDb.delete(deleteParams);
  return document;
});
