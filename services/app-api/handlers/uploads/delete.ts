import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { getUserCredentialsFromJwt } from "../../libs/authorization";
import { UserRoles } from "../../types";
import s3 from "../../libs/s3-lib";
import { DeleteObjectRequest } from "aws-sdk/clients/s3";

/**
 * Returns the report Sections associated with a given year and state
 */
export const deleteUpload = handler(async (event, _context) => {
  const user = getUserCredentialsFromJwt(event);
  if (user.role !== UserRoles.STATE) {
    throw new Error("User is not allowed to delete");
  }

  const body = event.body ? JSON.parse(event.body) : null;
  if (!body || !body.fileId) {
    throw new Error("Unable to perform deletion");
  }
  const state = event.pathParameters ? event.pathParameters["state"] : "";
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
  if (
    !results.Items ||
    results.Items.length === 0 ||
    !process.env.S3_ATTACHMENTS_BUCKET_NAME
  ) {
    throw new Error("Unable to perform deletion");
  }
  const document = results.Items[0];

  // DELETE AWS
  var params: DeleteObjectRequest = {
    Bucket: process.env.S3_ATTACHMENTS_BUCKET_NAME,
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
