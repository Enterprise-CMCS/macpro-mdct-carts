const seed = {
  name: "State",
  data: require("../../../data/seed-local/seed-state.json"),
  tableNameBuilder: (stage) => `${stage}-state`,
  keys: ["code", "year"],
};

module.exports = seed;
