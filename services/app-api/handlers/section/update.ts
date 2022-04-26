import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { convertToDynamoExpression } from "../dynamoUtils/convertToDynamoExpressionVars";
import { StateStatus } from "../../types";

/**
 * Updates the Sections associated with a given year and state
 */
export const updateSections = handler(async (event, _context) => {
  const { body } = event!;
  const reportData = JSON.parse(body || '{}');

  if (!event.pathParameters) throw new Error("No Path Parameters Object");
  if (!event.pathParameters.state || !event.pathParameters.year) {
    throw new Error(
      "Be sure to include state, year in the path" +
        event.pathParameters
    );
  }

  const { year, state } = event.pathParameters;

  // Update each of the Sections for the report
  // associated with the given year and state
  for (let section = 0; section < reportData.length; section++) {
    const params = {
      TableName: process.env.sectionTableName!,
      Key: {
        pk: `${state}-${year}`,
        sectionId: section,
      },
      ...convertToDynamoExpression(
        {
          contents: reportData[section].contents,
        },
        "post"
      ),
    };

    await dynamoDb.update(params);
  }

  // Check the State Status for this report and update it
  // to 'in_progress' if it is currently 'not_started'
  const params = {
    TableName: process.env.stateStatusTableName!,
    ...convertToDynamoExpression(
      {
        stateId: state,
        year: parseInt(year),
      },
      "list"
    ),
  };

  const queryValue = await dynamoDb.scan(params);
  const stateStatus = queryValue.Items![0] as StateStatus;

  if (queryValue.Items && stateStatus.status === "not_started") {
    const params = {
      TableName: process.env.stateStatusTableName!,
      Key: {
        stateId: state,
        year: parseInt(year),
      },
      ...convertToDynamoExpression(
        {
          status: "in_progress",
          lastChanged: new Date().toString(),
        },
        "post"
      ),
    };

    await dynamoDb.update(params);
  }
});
