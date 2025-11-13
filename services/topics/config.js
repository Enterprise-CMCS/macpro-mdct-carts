export default [
  {
    topicPrefix: "aws.carts.chip.cdc.dynamodb-",
    version: ".v0",
    numPartitions: 1,
    replicationFactor: 3,
    topics: ["section", "state-status"],
  },
];
