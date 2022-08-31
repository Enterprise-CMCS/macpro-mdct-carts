const seed = {
  name: "Section Base",
  data: require("../../../data/seed-local/seed-status.json"),
  tableNameBuilder: (stage) => `${stage}-state-status`,
  keys: ["stateId", "year"],
};

module.exports = seed;
