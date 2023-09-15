const seed = {
  name: "ACS 2022",
  data: require("../../../data/seed/seed-acs-2022.json"),
  tableNameBuilder: (stage) => `${stage}-acs`,
  keys: ["stateId", "year"],
};

module.exports = seed;
