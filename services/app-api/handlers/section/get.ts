import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { getUserCredentialsFromJwt } from "../../libs/authorization";
import { UserRoles } from "../../types";

/**
 * Returns the report Sections associated with a given year and state
 */
export const getSections = handler(async (event, _context) => {
  if (!event.pathParameters) throw new Error("No Path Parameters Object");
  if (!event.pathParameters.state || !event.pathParameters.year) {
    throw new Error(
      "Be sure to include state, year in the path" + event.pathParameters
    );
  }

  const user = getUserCredentialsFromJwt(event);
  const { year, state } = event.pathParameters;

  // only return the report if a state user is associated with the given state
  if (user.role === UserRoles.STATE && user.state !== state) {
    return [];
  } else {
    const params = {
      TableName: process.env.sectionTableName!,
      KeyConditionExpression: "pk = :pk",
      ExpressionAttributeValues: {
        ":pk": `${state}-${year}`,
      },
    };

    const queryValue = await dynamoDb.query(params);
    return queryValue.Items;
  }
});
