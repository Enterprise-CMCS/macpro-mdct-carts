import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { getUserCredentialsFromJwt } from "../../libs/authorization";
import { AppRoles } from "../../types";

/**
 * Returns a list of the staged SEDS enrollment counts for a year
 */
export const getEnrollmentCounts = handler(async (event, _context) => {
  if (!event.pathParameters) throw new Error("No Path Parameters Object");
  if (!event.pathParameters.state || !event.pathParameters.year) {
    throw new Error("Be sure to include state, year in the path");
  }

  const user = getUserCredentialsFromJwt(event);
  const { year, state } = event.pathParameters;

  if (user.role === AppRoles.STATE_USER && user.state !== state) {
    return [];
  } else {
    const params = {
      TableName: process.env.stageEnrollmentCountsTableName!,
      KeyConditionExpression: "pk = :pk",
      ExpressionAttributeValues: {
        ":pk": `${state}-${year}`,
      },
    };

    const queryValue = await dynamoDb.query(params);
    return queryValue.Items;
  }
});
