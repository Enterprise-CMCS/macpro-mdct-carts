import { kafkaConnect } from "../libs/kafka-connect";
import { v4 as uuidv4 } from "uuid";

async function myHandler(event, _context, _callback) {
  const json = JSON.parse(event.value);
  const currentYear = 2021;

  if (
    json.NewImage.enrollmentCounts &&
    json.NewImage.enrollmentCounts.year >= currentYear - 1 &&
    json.NewImage.quarter === 4
  ) {
    try {
      const { producer } = await kafkaConnect();

      const yearToSelect =
        json.NewImage.enrollmentCounts.year === currentYear ? 2 : 1;
      const typeOfEnrollment =
        json.NewImage.enrollmentCounts.type === "separate"
          ? "Separate CHIP"
          : "Medicaid Expansion CHIP";
      const enrollmentCount = json.NewImage.enrollmentCounts.count;
      const stateId = json.NewImage.state_id;

      await producer.send({
        topic: "aws.mdct.seds.cdc.enrollment-counts.v0",
        messages: [
          {
            key: uuidv4(),
            value: JSON.stringify({
              schema: {
                type: "struct",
                optional: false,
                name: "enrollment_counts",
                fields: [
                  {
                    type: "int32",
                    optional: false,
                    field: "year_to_modify",
                  },
                  {
                    type: "string",
                    optional: false,
                    field: "type_of_enrollment",
                  },
                  {
                    type: "int32",
                    optional: false,
                    field: "enrollment_count",
                  },
                  {
                    type: "string",
                    optional: false,
                    field: "filter_id",
                  },
                  {
                    type: "int32",
                    optional: false,
                    field: "index_to_update",
                  },
                  {
                    type: "string",
                    optional: false,
                    field: "state_id",
                  },
                ],
              },
              payload: {
                year_to_modify: currentYear,
                type_of_enrollment: typeOfEnrollment,
                enrollment_count: enrollmentCount,
                filter_id: `${currentYear}-02`,
                index_to_update: yearToSelect,
                state_id: stateId,
              },
            }),
          },
        ],
      });
      await producer.disconnect();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }
}

exports.handler = myHandler;
