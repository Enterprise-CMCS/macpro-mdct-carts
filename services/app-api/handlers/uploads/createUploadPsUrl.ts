import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import s3 from "../../libs/s3-lib";
import { fixLocalstackUrl } from "../../libs/localstack";
import { getUserCredentialsFromJwt } from "../../libs/authorization";
import { AppRoles } from "../../types";
import { convertToDynamoExpression } from "../dynamoUtils/convertToDynamoExpressionVars";
import { UnauthorizedError } from "../../libs/httpErrors";
/**
 * Updates the Sections associated with a given year and state
 */
export const psUpload = handler(async (event, _context) => {
  const user = getUserCredentialsFromJwt(event);
  if (user.role !== AppRoles.STATE_USER) {
    throw new UnauthorizedError("Unauthorized");
  }

  // Format Info
  const body = event.body ? JSON.parse(event.body) : null;
  const { uploadedFileName, questionId } = body;
  if (
    !event.pathParameters ||
    !event.pathParameters.state ||
    !event.pathParameters.year
  ) {
    throw new Error("Be sure to include state, year in the path");
  }
  const { state, year } = event.pathParameters;
  const username = user.email ?? "";
  const date = new Date();
  const randomValue = Math.floor(Math.random() * (100000 - 100) + 100)
    .toString()
    .padStart(7, "0"); // including a random value allows docs titled the same thing to be uploaded multiple times
  const dateString = `${date.getFullYear()}${date.getMonth()}${date.getDay()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}`;
  const awsFilename = `${username}_${randomValue}_${dateString}_${uploadedFileName}`;

  // Save file entry to dynamodb
  const uploadEntry = {
    uploadedUsername: username,
    uploadedDate: date.toString(),
    filename: uploadedFileName,
    awsFilename: awsFilename,
    questionId: questionId,
  };

  const params = {
    TableName: process.env.UploadsTable!,
    Key: {
      uploadedState: state,
      fileId: `${year}-${questionId}_${awsFilename}`, // questionId is not unique outside of a year
    },
    ...convertToDynamoExpression(uploadEntry, "post"),
  };
  await dynamoDb.update(params);

  // Pre-sign url
  let psurl = await s3.createPresignedPost({
    Bucket: process.env.attachmentsBucketName,
    Key: awsFilename,
  });
  psurl = fixLocalstackUrl(psurl);
  return { psurl };
});
