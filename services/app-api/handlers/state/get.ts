import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { AcsData, FmapData, State } from "../../types";

export const getStates = handler(async (_event, _context) => {
  const stateParams = {
    TableName: process.env.StateTable!,
  };
  const acsParams = {
    TableName: process.env.AcsTable!,
  };
  const fmapParams = {
    TableName: process.env.FmapTable!,
  };

  const stateQueryValue = await dynamoDb.scanAll<State>(stateParams);
  const acsQueryValue = await dynamoDb.scanAll<AcsData>(acsParams);
  const fmapQueryValue = await dynamoDb.scanAll<FmapData>(fmapParams);

  const states = stateQueryValue
    .map((state) => ({
      ...state,
      ...{
        fmapSet: fmapQueryValue.filter(({ stateId }) => stateId === state.code),
        acsSet: acsQueryValue.filter(({ stateId }) => stateId === state.code),
      },
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  return states;
});
