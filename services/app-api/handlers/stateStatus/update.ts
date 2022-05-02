import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { getUserCredentialsFromJwt } from "../../libs/authorization";
import { UserRoles, StateStatus } from "../../types";
import { convertToDynamoExpression } from "../dynamoUtils/convertToDynamoExpressionVars";

/**
 * Updates the State Status associated with a given year and state
 */
export const updateStateStatus = handler(async (event, _context) => {
    console.log('HELLO')
  const { body } = event;
  const { status, username } = JSON.parse(body || "{}");

  if (!event.pathParameters) throw new Error("No Path Parameters Object");
  if (!event.pathParameters.state || !event.pathParameters.year) {
    throw new Error(
      "Be sure to include state, year in the path" + event.pathParameters
    );
  }
  if (!status) {
    throw new Error("Cannot update State Status without a new status");
  }

  const user = getUserCredentialsFromJwt(event);
  const { year, state } = event.pathParameters;

  // state users can only update a state status associated with their assigned state
  if (user.role === UserRoles.STATE && user.state === state) {
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

    if (queryValue.Items) {
      const params = {
        TableName: process.env.stateStatusTableName!,
        Key: {
          stateId: state,
          year: parseInt(year),
        },
        ...convertToDynamoExpression(
          {
            status: "certified",
            username: username,
            lastChanged: new Date().toString(),
          },
          "post"
        ),
      };

      await dynamoDb.update(params);
    }
  }
});
