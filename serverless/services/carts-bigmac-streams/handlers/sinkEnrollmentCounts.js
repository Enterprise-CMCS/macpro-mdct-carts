import { kafkaConnect } from "../libs/kafka-connect";
import { v4 as uuidv4 } from "uuid";

async function myHandler(event, _context, _callback) {
  const json = JSON.parse(event.value);
  const currentYear = 2021;

  console.log(json);

  if (
    json.NewImage.enrollmentCounts &&
    json.NewImage.enrollmentCounts.year >= currentYear - 1 &&
    json.NewImage.quarter === 4
  ) {
    try {
      console.log("event is here", event);
      const { producer } = await kafkaConnect();
      const typeOfEnrollment =
        json.enrollmentCounts.type === "separate"
          ? "Separate CHIP"
          : "Medicaid Expansion CHIP";

      const yearToSelect = json.enrollmentCounts.year === currentYear ? 2 : 1;

      await producer.send({
        topic: "aws.mdct.seds.cdc.enrollment-counts.v0",
        messages: [
          {
            key: Math.floor(Math.random() * 1000 + 1).toString(),
            value: JSON.stringify({
              schema: {
                type: "struct",
                optional: false,
                name: "test",
                fields: [
                  {
                    type: "string",
                    optional: false,
                    field: "id",
                  },
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
                    field: "index_to_select",
                  },
                ],
              },
              payload: {
                id: uuidv4(),
                year_to_modify: currentYear,
                type_of_enrollment: typeOfEnrollment,
                enrollment_count: json.enrollmentCounts.count,
                filter_id: `${currentYear}-02`,
                index_to_select: yearToSelect,
              },
            }),
          },
        ],
      });
      await producer.disconnect();
    } catch (error) {
      console.log(error);
    }
  }
}

exports.handler = myHandler;
