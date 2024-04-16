const seed = {
  name: "FMAP",
  data: require("../../../data/seed/seed-fmap.json"),
  tableNameBuilder: (stage) => `${stage}-fmap`,
  keys: ["stateId", "fiscalYear"],
};

module.exports = seed;
