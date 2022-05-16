import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";

export const getStates = handler(async (_event, _context) => {
  // TODO collect map fmap & acs values
  const params = {
    TableName: process.env.stateTableName!,
  };
  const queryValue = await dynamoDb.scan(params);
  return queryValue.Items;
});
