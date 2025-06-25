import { getUserCredentialsFromJwt } from "../../libs/authorization";
import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { AppRoles, StateStatus } from "../../types";
import { convertToDynamoExpression } from "../dynamoUtils/convertToDynamoExpressionVars";

export const getStateStatus = handler(async (event, _context) => {
  const user = getUserCredentialsFromJwt(event);
  // eslint-disable-next-line no-console
  console.log("beep");
  if (user.role === AppRoles.STATE_USER && !!user.state) {
    // Return only the user's state
    const params = {
      TableName: process.env.StateStatusTableName!,
      ...convertToDynamoExpression({ stateId: user.state }, "list"),
    };
    const queryValue = await dynamoDb.scanSome<StateStatus>(params);
    return queryValue;
  } else if (
    user.role === AppRoles.CMS_ADMIN ||
    user.role === AppRoles.INTERNAL_USER ||
    user.role === AppRoles.HELP_DESK ||
    user.role === AppRoles.CMS_APPROVER ||
    user.role === AppRoles.CMS_USER
  ) {
    // Return all
    const params = {
      TableName: process.env.StateStatusTableName!,
    };
    const queryValue = await dynamoDb.scanSome<StateStatus>(params);
    return queryValue;
  } else {
    return [];
  }
});
