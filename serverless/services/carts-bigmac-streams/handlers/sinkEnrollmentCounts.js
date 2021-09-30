const { Kafka } = require("kafkajs");

async function myHandler(event, _context, _callback) {
  const kafka = new Kafka({
    clientId: `sed-${process.env.STAGE}`,
    brokers: process.env.BOOTSTRAP_BROKER_STRING_TLS.split(","),
    retry: {
      initialRetryTime: 300,
      retries: 8,
    },
    ssl: {
      rejectUnauthorized: false,
    },
  });

  const producer = kafka.producer();

  await producer.connect();

  await producer.send({
    topic: "aws.mdct.seds.cdc.enrollment-counts.v0",
    messages: [event],
  });

  console.log(producer);

  await producer.disconnect();
  console.log(event.value);
  console.log("brian");
  console.log("hello");
}

exports.handler = myHandler;
