const seed = {
  name: "ACS 2023",
  data: require("../../../data/seed/seed-acs-2023.json"),
  tableNameBuilder: (stage) => `${stage}-acs`,
  keys: ["stateId", "year"],
};

module.exports = seed;
