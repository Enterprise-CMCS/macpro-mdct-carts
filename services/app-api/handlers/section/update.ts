import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { getUserCredentialsFromJwt } from "../../libs/authorization";
import { AppRoles, StateStatus } from "../../types";
import { convertToDynamoExpression } from "../dynamoUtils/convertToDynamoExpressionVars";
import { UnauthorizedError } from "../../libs/httpErrors";
import { Validator } from "jsonschema";
import { sectionSchema } from "../../libs/validation/backend-section.schema";

/**
 * Updates the Sections associated with a given year and state
 */
export const updateSections = handler(async (event, _context) => {
  const { body } = event;
  const reportData = JSON.parse(body || "{}");

  if (!event.pathParameters) throw new Error("No Path Parameters Object");
  if (!event.pathParameters.state || !event.pathParameters.year) {
    throw new Error("Be sure to include state, year in the path");
  }

  const user = getUserCredentialsFromJwt(event);
  const { year, state } = event.pathParameters;

  // only state users can update reports associated with their assigned state
  if (
    (user.role === AppRoles.STATE_USER && user.state !== state) ||
    user.role !== AppRoles.STATE_USER
  ) {
    throw new UnauthorizedError("Unauthorized Request");
  }

  // Check validity of post
  const validator = new Validator();
  for (let section = 0; section < reportData.length; section++) {
    const validationResults = validator.validate(
      reportData[section].contents,
      sectionSchema
    );
    if (validationResults.errors && validationResults.errors.length > 0)
      throw new Error("Invalid section object.");
  }

  // Update each of the Sections for the report associated with the given year and state
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

  const params = {
    TableName: process.env.stateStatusTableName!,
    KeyConditionExpression:
      "stateId = :stateId AND #currentYear = :currentYear",
    ExpressionAttributeValues: {
      ":stateId": state,
      ":currentYear": parseInt(year),
    },
    ExpressionAttributeNames: {
      "#currentYear": "year",
    },
  };

  const queryValue = await dynamoDb.query(params);
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
