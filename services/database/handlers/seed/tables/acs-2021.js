const seed = {
  name: "ACS 2021",
  data: require("../../../data/seed/seed-acs-2021.json"),
  tableNameBuilder: (stage) => `${stage}-acs`,
  keys: ["stateId", "year"],
};

module.exports = seed;
