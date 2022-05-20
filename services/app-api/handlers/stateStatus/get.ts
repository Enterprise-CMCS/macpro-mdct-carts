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
    user.role === UserRoles.ADMIN ||
    user.role === UserRoles.BO ||
    user.role === UserRoles.CO ||
    user.role === UserRoles.HELP
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
