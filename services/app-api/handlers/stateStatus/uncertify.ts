import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { getUserCredentialsFromJwt } from "../../libs/authorization";
import { UserRoles } from "../../types";
import { convertToDynamoExpression } from "../dynamoUtils/convertToDynamoExpressionVars";

/**
 * Uncertifies a CARTS report
 */
export const uncertifyReport = handler(async (event, _context) => {
  const { body } = event;
  const { username } = JSON.parse(body || "{}");
  const status = 'in_progress';

  if (!event.pathParameters) throw new Error("No Path Parameters Object");
  if (!event.pathParameters.state || !event.pathParameters.year) {
    throw new Error("Be sure to include state, year in the path");
  }

  const user = getUserCredentialsFromJwt(event);
  const { year, state } = event.pathParameters;

  // only Approvers can uncertify a CARTS report
  // eslint-disable-next-line
  // TODO: update ADMIN with APPROVER
  if (user.role === UserRoles.ADMIN) {
    const uncertifyReportParams = {
      TableName: process.env.stateStatusTableName!,
      Key: {
        stateId: state,
        year: parseInt(year),
      },
      ...convertToDynamoExpression(
        {
          username: username,
          lastChanged: new Date().toString(),
          status: status
        },
        "post"
      ),
    };

    await dynamoDb.update(uncertifyReportParams);
  }
});
