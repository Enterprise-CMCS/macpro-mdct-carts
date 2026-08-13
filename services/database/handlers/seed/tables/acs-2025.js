const seed = {
  name: "ACS 2025",
  data: require("../../../data/seed/seed-acs-2025.json"),
  tableNameBuilder: (stage) => `${stage}-acs`,
  keys: ["stateId", "year"],
};

module.exports = seed;
