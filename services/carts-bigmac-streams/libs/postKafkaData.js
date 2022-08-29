import KafkaSourceLib from "./kafka-source-lib";

/**
 * Tables here should match the tables defined as triggers in the carts-bigmac-streams/serverless.js file,
 * and those same tables should have data streams defined in the database/serverless.js file.
 */
export class PostKafkaData extends KafkaSourceLib {
  topicPrefix = "aws.carts.chip.cdc.dynamodb-";
  version = "v0";
  tables = ["section", "state-status"];
}
