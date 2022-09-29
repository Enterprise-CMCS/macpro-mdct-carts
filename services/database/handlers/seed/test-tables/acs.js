const seed = {
  name: "ACS",
  data: require("../../../data/seed-local/seed-acs.json"),
  tableNameBuilder: (stage) => `${stage}-acs`,
  keys: ["stateId", "year"],
};

module.exports = seed;
