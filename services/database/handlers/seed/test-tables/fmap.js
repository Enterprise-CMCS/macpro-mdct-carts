const seed = {
  name: "FMAP",
  data: require("../../../data/seed-local/seed-fmap.json"),
  tableNameBuilder: (stage) => `${stage}-fmap`,
  keys: ["fiscalYear", "stateId"],
};

module.exports = seed;
