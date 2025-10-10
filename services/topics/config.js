export default [
  {
    topicPrefix: "aws.mdct.carts",
    version: ".v0",
    numPartitions: 1,
    replicationFactor: 3,
    topics: [
      ".state-status",
      ".section",
      ".section-base",
      ".enrollment-counts",
      ".uploads",
      ".carts-reports",
    ],
  },
];
