const seed = {
  name: "Section Base",
  data: require("../../../data/seed/seed-section-base.json"),
  tableNameBuilder: (stage) => `${stage}-section-base`,
  keys: ["sectionId", "year"],
};

module.exports = seed;
