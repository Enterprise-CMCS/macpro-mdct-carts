const seed = {
  name: "ACS 2026",
  data: require("../../../data/seed/seed-acs-2026.json"),
  tableNameBuilder: (stage) => `${stage}-acs`,
  keys: ["stateId", "year"],
};

module.exports = seed;
