import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";

export const getStates = handler(async (_event, _context) => {
  const params = {
    TableName: process.env.stateTableName!,
  };
  const queryValue = await dynamoDb.scan(params);
  // TODO collect map fmap & acs values
  const states = queryValue.Items?.map((state) => ({
    ...state,
    ...{ fmap_set: [], acs_set: [] },
  }));
  return states;
});
