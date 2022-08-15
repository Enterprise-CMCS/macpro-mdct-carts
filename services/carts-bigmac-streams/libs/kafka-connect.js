import { Kafka } from "kafkajs";

export const kafkaConnect = async () => {
  try {
    const kafka = new Kafka({
      clientId: `carts-${process.env.STAGE}`,
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

    return {
      producer,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};
