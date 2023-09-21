import { JSONPath } from "jsonpath-plus";
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
  const lastChanged = new Date().toString();
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
          lastChanged: lastChanged,
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
  const moveToInProgress =
    queryValue.Items && stateStatus.status === "not_started";

  const statusParams = {
    TableName: process.env.stateStatusTableName!,
    Key: {
      stateId: state,
      year: parseInt(year),
    },
    ...convertToDynamoExpression(
      {
        status: moveToInProgress ? "in_progress" : stateStatus.status,
        lastChanged: lastChanged,
        programType: getProgramType(year, reportData, stateStatus?.programType),
      },
      "post"
    ),
  };

  await dynamoDb.update(statusParams);
});

const PROGRAM_TYPE_QUESTION_ID = "-00-a-01-02";

const getProgramType = (
  year: string,
  reportData: any,
  programType: string | undefined
) => {
  // attempt to find programType from same year as form
  const currentProgramType = programType;
  let idExpression = `${year}${PROGRAM_TYPE_QUESTION_ID}`;
  let jpexpr = `$..*[?(@ && @.id=='${idExpression}')]`;
  let fragment = JSONPath({ path: jpexpr, json: reportData[0].contents });
  let currentYearProgramType = fragment?.[0]?.answer?.entry;

  if (currentYearProgramType) {
    return currentYearProgramType;
  }
  // attempt to find programType from the previous year's form
  const previousYear = parseInt(year) - 1;
  idExpression = `${previousYear}${PROGRAM_TYPE_QUESTION_ID}`;
  jpexpr = `$..*[?(@ && @.id=='${idExpression}')]`;
  fragment = JSONPath({ path: jpexpr, json: reportData[0].contents });
  const previousYearProgramType = fragment?.[0]?.answer?.entry;
  return previousYearProgramType ?? currentProgramType;
};
