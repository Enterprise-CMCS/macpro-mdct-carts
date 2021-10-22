import { kafkaConnect } from "../libs/kafka-connect";

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
                    field: "test",
                  },
                  {
                    type: "int32",
                    optional: true,
                    field: "id",
                  },
                ],
              },
              payload: {
                test: "test data",
                id: Math.floor(Math.random() * 15000) + 1,
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
