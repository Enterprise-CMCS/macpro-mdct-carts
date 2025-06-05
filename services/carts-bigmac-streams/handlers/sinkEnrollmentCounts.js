import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { buildClient, convertToDynamoExpression } from "../libs/dynamo-lib.js";

/**
 * Handler for enrollment count events that come across kafka from SEDS
 * The enrollment counts are loaded into a seperate table to be loaded alongside
 * section 2 in CARTS.
 *
 * @param {*} event
 * @param {*} _context
 * @param {*} _callback
 */
export async function handler(event, _context, _callback) {
  const sedsTopicKey = `${process.env.sedsTopic}-0`;
  if (!event?.records?.[sedsTopicKey]) {
    return;
  }
  const records = event.records[sedsTopicKey];
  const currentYear = getReportingYear();
  const dynamoClient = buildClient();

  for (const record of records) {
    const decodedValue = atob(record.value);
    const value = JSON.parse(decodedValue);
    if (
      value.NewImage.enrollmentCounts &&
      value.NewImage.enrollmentCounts.year >= currentYear - 1 &&
      value.NewImage.quarter === 4
    ) {
      try {
        // eslint-disable-next-line no-console
        console.log("Sink message received", value);
        const indexToUpdate =
          value.NewImage.enrollmentCounts.year === currentYear ? 2 : 1;
        let typeOfEnrollment = "Medicaid Expansion CHIP";
        let typeKey = "medicaid_exp_chip";
        if (value.NewImage.enrollmentCounts.type === "separate") {
          typeOfEnrollment = "Separate CHIP";
          typeKey = "separate_chip";
        }
        const stateId = value.NewImage.state_id;
        const createdTime = new Date().toLocaleString();

        const pk = `${stateId}-${currentYear}`;
        const entryKey = `${typeKey}-${indexToUpdate}`;

        const enrollmentEntry = {
          filterId: `${currentYear}-02`,
          typeOfEnrollment,
          indexToUpdate,
          stateId,
          yearToModify: currentYear,
          enrollmentCount: value.NewImage.enrollmentCounts.count,
          createdTime,
          lastSynced: value.NewImage.lastSynced ?? "",
        };

        await updateEnrollment(pk, entryKey, enrollmentEntry, dynamoClient);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    }
  }
}

const updateEnrollment = async (pk, entryKey, enrollmentData, dynamoClient) => {
  const params = {
    TableName: process.env.StageEnrollmentCountsTableName,
    Key: {
      pk: pk,
      entryKey: entryKey,
    },
    ...convertToDynamoExpression(enrollmentData),
  };
  await dynamoClient.send(new UpdateCommand(params));
};

/**
 * SEDS Data is reported for Q4 (July 1 - Sep 30) starting on Oct 1
 * Forms are not available to SEDS users before that date.
 *
 * @returns fiscalYear
 */
const getReportingYear = () => {
  const today = new Date();
  const month = today.getMonth() + 1;

  let fiscalyear = today.getFullYear();
  if (month < 10) fiscalyear -= 1;
  return fiscalyear;
};
