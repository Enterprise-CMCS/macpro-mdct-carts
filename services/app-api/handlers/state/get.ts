import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { State } from "../../types";

export const getStates = handler(async (_event, _context) => {
  const params = {
    TableName: process.env.stateTableName!,
  };
  const queryValue = await dynamoDb.scan(params);
  // TODO collect map fmap & acs values
  const states = queryValue.Items?.map((state) => ({
    ...state as State,
    ...{ fmap_set: [], acs_set: [] },
  })).sort((a, b) => a.name.localeCompare(b.name));
  return states;
});
