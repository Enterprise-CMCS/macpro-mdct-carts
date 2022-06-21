import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { State } from "../../types";

export const getStates = handler(async (_event, _context) => {
  let stateParams = {
    TableName: process.env.stateTableName!,
  };

  let stateQueryValue = await dynamoDb.scan(stateParams);

  // eslint-disable-next-line
  // let acsParams = {
  //   TableName: process.env.acsTableName!,
  // };
  // let fmapParams = {
  //   TableName: process.env.fmapTableName!,
  // };
  // todo grab from other tables
  // let acsQueryValue = await dynamoDb.scan(acsParams);
  // console.log("acs", acsQueryValue);
  // let fmapQueryValue = await dynamoDb.scan(fmapParams);
  // console.log("fmap", fmapQueryValue);

  const states = stateQueryValue.Items?.map((state) => ({
    ...(state as State),
    ...{ fmapSet: [], acsSet: [] },
  })).sort((a, b) => a.name.localeCompare(b.name));
  return states;
});
