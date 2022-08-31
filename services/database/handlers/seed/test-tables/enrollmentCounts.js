const seed = {
  name: "Enrollment Counts",
  data: require("../../../data/seed-local/seed-stg-enrollment-counts.json"),
  tableNameBuilder: (stage) => `${stage}-stg-enrollment-counts`,
  keys: ["pk", "entryKey"],
};

module.exports = seed;
