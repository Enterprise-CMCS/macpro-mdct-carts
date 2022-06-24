import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { getUserCredentialsFromJwt } from "../../libs/authorization";
import { AppRoles } from "../../types";
import s3 from "../../libs/s3-lib";
import { DeleteObjectRequest } from "aws-sdk/clients/s3";
import { UnauthorizedError } from "../../libs/httpErrors";

/**
 * Returns the report Sections associated with a given year and state
 */
export const deleteUpload = handler(async (event, _context) => {
  const user = getUserCredentialsFromJwt(event);
  const body = event.body ? JSON.parse(event.body) : null;
  const state = event.pathParameters ? event.pathParameters["state"] : "";

  if (user.role !== AppRoles.STATE_USER || !body || !body.fileId || !state) {
    throw new UnauthorizedError("Unauthorized");
  }
  // Get file, check aws filename before deleting
  const documentParams = {
    TableName: process.env.uploadsTableName!,
    KeyConditionExpression:
      "uploadedState = :uploadedState AND fileId = :fileId",
    ExpressionAttributeValues: {
      ":uploadedState": state,
      ":fileId": body.fileId,
    },
  };
  const results = await dynamoDb.query(documentParams);
  if (!results.Items || results.Items.length === 0) {
    throw new Error("Unauthorized");
  }
  const document = results.Items[0];

  // DELETE AWS
  var params: DeleteObjectRequest = {
    Bucket: process.env.S3_ATTACHMENTS_BUCKET_NAME ?? "local-uploads",
    Key: document.awsFilename,
  };
  await s3.deleteObject(params);

  // DELETE Dynamo entry
  const deleteParams = {
    TableName: process.env.uploadsTableName!,
    Key: {
      uploadedState: state,
      fileId: body.fileId,
    },
  };

  await dynamoDb.delete(deleteParams);
  return document;
});
