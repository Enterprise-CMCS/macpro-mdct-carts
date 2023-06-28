import { getUserCredentialsFromJwt } from "../../libs/authorization";
import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { AppRoles } from "../../types";
import { convertToDynamoExpression } from "../dynamoUtils/convertToDynamoExpressionVars";

export const getStateStatus = handler(async (event, _context) => {
  const user = getUserCredentialsFromJwt(event);
  if (user.role === AppRoles.STATE_USER && !!user.state) {
    // Return only the user's state
    const params = {
      TableName: process.env.stateStatusTableName!,
      ...convertToDynamoExpression({ stateId: user.state }, "list"),
    };
    const queryValue = await dynamoDb.scan(params);
    return queryValue;
  } else if (
    user.role === AppRoles.CMS_ADMIN ||
    user.role === AppRoles.HELP_DESK ||
    user.role === AppRoles.CMS_APPROVER ||
    user.role === AppRoles.CMS_USER
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
