import { kafkaConnect } from "../libs/kafka-connect";
import { v4 as uuidv4 } from "uuid";

async function myHandler(event, _context, _callback) {
  const json = JSON.parse(event.value);

  if (json.NewImage.enrollmentCounts) {
    try {
      console.log("event is here", event);
      const { producer } = await kafkaConnect();
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
                    type: "string",
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
                year_to_modify: 2021,
                type_of_enrollment: "",
                enrollment_count: 0,
                filter_id: "2021-02",
                index_to_select: 3,
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
