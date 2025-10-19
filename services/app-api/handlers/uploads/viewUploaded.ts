import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
/**
 * Updates the Sections associated with a given year and state
 */
export const viewUploaded = handler(async (event, _context) => {
  // State users are prohibited from accessing URLs for other states
  if (!event.pathParameters) {
    throw new Error("Path Parameters required");
  }
  const { state, year } = event.pathParameters;
  const body = event.body ? JSON.parse(event.body) : null;
  const { questionId } = body;

  const params = {
    TableName: process.env.UploadsTable!,
    KeyConditionExpression:
      "#uploadedState = :uploadedState and begins_with(#fileId, :fileId)",
    ExpressionAttributeNames: {
      "#uploadedState": "uploadedState",
      "#fileId": "fileId",
    },
    ExpressionAttributeValues: {
      ":uploadedState": state,
      ":fileId": `${year}-${questionId}`,
    },
  };

  const queryValue = await dynamoDb.query(params);
  return queryValue.Items;
});
