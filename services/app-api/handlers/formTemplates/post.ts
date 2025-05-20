import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { getUserCredentialsFromJwt } from "../../libs/authorization";
import { State, StateStatus, AppRoles, Section } from "../../types";
import { NotFoundError, UnauthorizedError } from "../../libs/httpErrors";

/**
 * Updates the State Status associated with a given year and state
 */
export const post = handler(async (event, _context) => {
  const { body } = event;
  const { year } = JSON.parse(body || "{}");

  // Validate user
  const user = getUserCredentialsFromJwt(event);
  if (user.role != AppRoles.CMS_ADMIN) {
    throw new UnauthorizedError("Unauthorized Request");
  }

  // Determine which, if any, states need forms
  const yearNumber = parseInt(year);
  const states = await getAllStates();
  const existingStates = await getExistingStates(yearNumber);

  const queuedStates = states?.filter(
    (state) => !existingStates.includes(state.code)
  );
  if (queuedStates.length === 0) {
    return `All templates for year ${year} have already been generated.`;
  }
  const baseSections = await getBaseSections(yearNumber);
  if (!baseSections || baseSections.length === 0) {
    throw new NotFoundError(
      `Base Section Templates not found for year ${year}`
    );
  }

  // Copy out report string and populate state data
  const forms = [];
  const stateStatuses = [];
  const creationTime = new Date().toString();
  for (const state of queuedStates) {
    for (const section of baseSections) {
      state;
      let modifiedSection = section.replace("~XX~", state.code);
      let sectionObj = JSON.parse(modifiedSection) as Section;
      sectionObj.pk = `${state.code}-${year}`;
      sectionObj.year = yearNumber;
      sectionObj.stateId = state.code;
      sectionObj.contents.section.state = state.code;
      sectionObj.lastChanged = creationTime;

      // Section 0 Special Case - Program Type should be read from State
      if (sectionObj.sectionId === 0) {
        sectionObj.contents.section.subsections[0].parts[0].questions[1].answer.entry =
          state.programType;
      }
      forms.push(sectionObj);
    }
    stateStatuses.push({
      stateId: state.code,
      year: yearNumber,
      programType: state.programType,
      status: "not_started",
      lastChanged: creationTime,
    });
  }

  await saveBatch(process.env.SectionTableName!, forms);
  await saveBatch(process.env.StateStatusTableName!, stateStatuses);

  return {
    message: `State templates generated for year ${year}`,
    generatedForms: [queuedStates.map((s) => s.code)],
  };
});

// Queries
const getAllStates = async () => {
  // Get all known states
  const params = {
    TableName: process.env.StateTableName!,
  };
  return await dynamoDb.scanAll<State>(params);
};

const getExistingStates = async (year: number) => {
  // Get already created entries for the given year
  const params = {
    TableName: process.env.StateStatusTableName!,
    ExpressionAttributeNames: {
      "#year": "year",
    },
    ExpressionAttributeValues: {
      ":year": year,
    },
    FilterExpression: "#year = :year",
  };

  const results = await dynamoDb.scanAll<StateStatus>(params);
  return results.map((state) => state.stateId);
};

const getBaseSections = async (year: number) => {
  const params = {
    TableName: process.env.SectionBaseTableName!,
    ExpressionAttributeNames: {
      "#year": "year",
    },
    ExpressionAttributeValues: {
      ":year": year,
    },
    FilterExpression: "#year = :year",
  };
  const sections = await dynamoDb.scanAll<Section>(params);
  return sections.map((s) => JSON.stringify(s));
};

const saveBatch = async (tableName: string, items: Record<string, any>) => {
  // Save new forms
  var batch = []; // DynamoDB batchWriteItem takes 25 items max
  for (let i = 0; i < items.length; i++) {
    batch.push({ PutRequest: { Item: items[i] } });
    // Submit every 25, or when you're on the last item
    if (i == items.length - 1 || batch.length == 25) {
      await dynamoDb.batchWriteItem({
        RequestItems: {
          [tableName]: batch,
        },
      });
      batch = []; // clear queue
    }
  }
};
