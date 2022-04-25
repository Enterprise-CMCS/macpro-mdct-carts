import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { convertToDynamoExpression } from "../dynamoUtils/convertToDynamoExpressionVars";

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

  const { year, state } = event.pathParameters;

  const params = {
    TableName: process.env.sectionTableName!,
    ...convertToDynamoExpression(
      {
        year: parseInt(year),
        stateId: state,
      },
      "list"
    ),
  };

  const queryValue = await dynamoDb.scan(params);
  return queryValue;
});
