export default [
  {
    topicPrefix: "aws.carts.chip.cdc",
    version: ".v0",
    numPartitions: 1,
    replicationFactor: 3,
    topics: [".dynamodb-section", ".dynamodb-state-status"],
  },
];
