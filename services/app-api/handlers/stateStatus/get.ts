import { getUserCredentialsFromJwt } from "../../libs/authorization";
import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { UserRoles } from "../../types";
import { convertToDynamoExpression } from "../dynamoUtils/convertToDynamoExpressionVars";

export const getStateStatus = handler(async (event, _context) => {
  const user = getUserCredentialsFromJwt(event);
  if (user.role === UserRoles.STATE && !!user.state) {
    // Return only the user's state
    const params = {
      TableName: process.env.stateStatusTableName!,
      ...convertToDynamoExpression({ stateId: user.state }, "list"),
    };
    const queryValue = await dynamoDb.scan(params);
    return queryValue;
  } else if (
    user.role === UserRoles.APPROVER ||
    user.role === UserRoles.HELP ||
    user.role === UserRoles.PROJECT_OFFICER ||
    user.role === UserRoles.BUSINESS_OWNER_REP
  ) {
    // Return all
    const params = {
      TableName: process.env.stateStatusTableName!,
    };
    const queryValue = await dynamoDb.scan(params);
    return queryValue;
  } else {
    return [];
  }
});
