import { KafkaSourceLib } from "../../../libs/kafka-source-lib.js";
/**
 * Binds the topics for Kafka output to a handler, triggered by data streams
 */
class PostKafkaData extends KafkaSourceLib {
  topicPrefix = "aws.carts.chip.cdc.dynamodb-";
  version = "v0";
  tables = ["section", "state-status"];
}

const postKafkaData = new PostKafkaData();

export const handler = postKafkaData.handler.bind(postKafkaData);
