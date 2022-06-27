import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { State } from "../../types";

export const getStates = handler(async (_event, _context) => {
  const stateParams = {
    TableName: process.env.stateTableName!,
  };
  const acsParams = {
    TableName: process.env.acsTableName!,
  };
  const fmapParams = {
    TableName: process.env.fmapTableName!,
  };

  const stateQueryValue = await dynamoDb.scan(stateParams);
  const acsQueryValue = await dynamoDb.scan(acsParams);
  const fmapQueryValue = await dynamoDb.scan(fmapParams);

  const states = stateQueryValue.Items?.map((state) => ({
    ...(state as State),
    ...{ fmapSet: fmapQueryValue.Items, acsSet: acsQueryValue.Items },
  })).sort((a, b) => a.name.localeCompare(b.name));
  return states;
});
