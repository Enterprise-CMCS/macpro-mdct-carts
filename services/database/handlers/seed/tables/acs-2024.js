const seed = {
  name: "ACS 2024",
  data: require("../../../data/seed/seed-acs-2024.json"),
  tableNameBuilder: (stage) => `${stage}-acs`,
  keys: ["stateId", "year"],
};

module.exports = seed;
