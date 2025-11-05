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
  const counts: any[] = [];

  if (user.role === AppRoles.STATE_USER && user.state !== state) {
    return counts;
  } else {
    // Current year values
    const currentParams = {
      TableName: process.env.StageEnrollmentCountsTable!,
      KeyConditionExpression: "pk = :pk",
      ExpressionAttributeValues: {
        ":pk": `${state}-${year}`,
      },
    };
    const currentYearQuery = await dynamoDb.query(currentParams);
    if (currentYearQuery.Items) {
      counts.push(...currentYearQuery.Items);
    }
    // Provide past year values as fallback
    const pastYear = parseInt(year) - 1;
    const pastParams = {
      TableName: process.env.StageEnrollmentCountsTable!,
      KeyConditionExpression: "pk = :pk",
      ExpressionAttributeValues: {
        ":pk": `${state}-${pastYear}`,
      },
    };
    const pastYearQuery = await dynamoDb.query(pastParams);
    if (pastYearQuery.Items) {
      counts.push(...pastYearQuery.Items);
    }
  }
  return counts;
});
