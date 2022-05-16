import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { getUserCredentialsFromJwt } from "../../libs/authorization";
import { State, StateStatus, UserRoles } from "../../types";
import { NotFoundError, UnauthorizedError } from "../../libs/httpErrors";

/**
 * Updates the State Status associated with a given year and state
 */
export const post = handler(async (event, _context) => {
  const { body } = event;
  const { year } = JSON.parse(body || "{}");

  // Validate user
  const user = getUserCredentialsFromJwt(event);
  if (user.role != UserRoles.BUSINESS_OWNER_REP) {
    throw new UnauthorizedError("Unauthorized Request");
  }

  const states = await getAllStates();
  const existingStates = await getExistingStates(year);

  const queuedStates = states?.filter(
    (state) => !existingStates.includes(state.code)
  );
  if (queuedStates.length === 0) {
    return `All templates for year ${year} have already been generated.`;
  }
  const baseSections = await getBaseSections(year);
  if (!baseSections || baseSections.length === 0) {
    throw new NotFoundError(
      `Base Section Templates not found for year ${year}`
    );
  }

  // Copy out report string and populate state data
  const forms = [];
  for (const state of queuedStates) {
    for (const section of baseSections) {
      state;
      let modifiedSection = section.replace("~XX~", state.code);
      let sectionObj = JSON.parse(modifiedSection);
      sectionObj.year = year;
      sectionObj.state = state.code;
      forms.push({
        PutRequest: {
          Item: sectionObj,
        },
      });
    }
  }

  await dynamoDb.batchWriteItem({
    RequestItems: {
      [process.env.stateStatusTableName!]: forms,
    },
  });
  // TODO: save new items to db
  return `State templates generated for year ${year}`;
});

// Queries
const getAllStates = async () => {
  // Get all known states
  const params = {
    TableName: process.env.stateTableName!,
  };
  const queryValue = await dynamoDb.scan(params);
  return queryValue.Items as Array<State>;
};

const getExistingStates = async (year: number) => {
  // Get already created entries for the given year
  const params = {
    TableName: process.env.stateStatusTableName!,
    ExpressionAttributeNames: {
      "#year": "year",
    },
    ExpressionAttributeValues: {
      ":year": year,
    },
    FilterExpression: "#year = :year",
  };

  const queryValue = await dynamoDb.scan(params);
  const results = queryValue.Items as Array<StateStatus>;
  return results.map((state) => state.stateId);
};

const getBaseSections = async (year: number) => {
  const params = {
    TableName: process.env.sectionBaseTableName!,
    ExpressionAttributeNames: {
      "#year": "year",
    },
    ExpressionAttributeValues: {
      ":year": year,
    },
    FilterExpression: "#year = :year",
  };
  const queryValue = await dynamoDb.scan(params);
  return queryValue.Items?.map((s) => JSON.stringify(s));
};
