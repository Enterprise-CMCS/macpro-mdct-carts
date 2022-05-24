import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { getUserCredentialsFromJwt } from "../../libs/authorization";
import { UserRoles } from "../../types";
import { convertToDynamoExpression } from "../dynamoUtils/convertToDynamoExpressionVars";

/**
 * Updates the State Status associated with a given year and state
 */
export const updateStateStatus = handler(async (event, _context) => {
  const { body } = event;
  const { status, username } = JSON.parse(body || "{}");

  if (!event.pathParameters) throw new Error("No Path Parameters Object");
  if (!event.pathParameters.state || !event.pathParameters.year) {
    throw new Error("Be sure to include state, year in the path");
  }
  if (!status || !username) {
    throw new Error(
      "Cannot update State Status without a new status and username"
    );
  }

  const user = getUserCredentialsFromJwt(event);
  const { year, state } = event.pathParameters;

  // state users can only update a state status associated with their assigned state
  if (user.role === UserRoles.STATE && user.state === state) {
    const updateStateStatusparams = {
      TableName: process.env.stateStatusTableName!,
      Key: {
        stateId: state,
        year: parseInt(year),
      },
      ...convertToDynamoExpression(
        {
          status: status,
          username: username,
          lastChanged: new Date().toString(),
        },
        "post"
      ),
    };

    await dynamoDb.update(updateStateStatusparams);
  }

  /**
   * Approver uncertifies a CARTS report
   */
  // eslint-disable-next-line
  // TODO: update ADMIN with APPROVER role
  else if (user.role === UserRoles.APPROVER) {
    const uncertifyReportParams = {
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

    await dynamoDb.update(uncertifyReportParams);
  }
});
