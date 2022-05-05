import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import s3 from "../../libs/s3-lib";
import { getUserCredentialsFromJwt } from "../../libs/authorization";
import { UserRoles } from "../../types";

/**
 * Returns the report Sections associated with a given year and state
 */
export const getSignedFileUrl = handler(async (event, _context) => {
  const user = getUserCredentialsFromJwt(event);
  const state = event.pathParameters ? event.pathParameters["state"] : "";
  if (user.role === UserRoles.STATE && user.state !== state) {
    return;
  }

  const body = event.body ? JSON.parse(event.body) : null;
  if (!body || !body.fileId) {
    throw new Error("Unable to find info");
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
  if (
    !results.Items ||
    results.Items.length === 0 ||
    !process.env.S3_ATTACHMENTS_BUCKET_NAME
  ) {
    throw new Error("Cannot find file");
  }
  const document = results.Items[0];
  // Pre-sign url
  const url = s3.getSignedUrl("getObject", {
    Bucket: process.env.S3_ATTACHMENTS_BUCKET_NAME,
    Key: document.awsFilename,
    ResponseContentDisposition: `attachment; filename = ${document.filename}`,
    Expires: 3600,
  });
  return {
    psurl: url,
  };
});
