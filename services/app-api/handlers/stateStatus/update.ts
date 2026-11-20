import handler from "../../libs/handler-lib";
import { BadRequestError } from "../../libs/httpErrors";
import dynamoDb from "../../libs/dynamodb-lib";
import { AppRoles } from "../../types";
import { convertToDynamoExpression } from "../dynamoUtils/convertToDynamoExpressionVars";

/**
 * Updates the State Status associated with a given year and state
 */
export const updateStateStatus = handler(async (event, _context, user) => {
  const { body } = event;
  const { status } = JSON.parse(body || "{}");

  if (!event.pathParameters)
    throw new BadRequestError("No Path Parameters Object");
  if (!event.pathParameters.state || !event.pathParameters.year) {
    throw new BadRequestError("Be sure to include state, year in the path");
  }
  if (!status) {
    throw new BadRequestError(
      "Cannot update State Status without a new status"
    );
  }

  const { year, state } = event.pathParameters;

  // state users can only update a state status associated with their assigned state
  if (user.role === AppRoles.STATE_USER && user.state === state) {
    const updateStateStatusparams = {
      TableName: process.env.StateStatusTable!,
      Key: {
        stateId: state,
        year: parseInt(year),
      },
      ...convertToDynamoExpression(
        {
          status: status,
          username: user.name,
          lastChanged: new Date().toString(),
        },
        "post"
      ),
    };

    await dynamoDb.update(updateStateStatusparams);
  } else if (
    user.role === AppRoles.CMS_USER ||
    user.role === AppRoles.CMS_ADMIN ||
    user.role === AppRoles.CMS_APPROVER
  ) {
    /**
     * CMS_User, CMS_Admin, and CMS_Approver uncertifies a CARTS report
     */
    const uncertifyReportParams = {
      TableName: process.env.StateStatusTable!,
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
