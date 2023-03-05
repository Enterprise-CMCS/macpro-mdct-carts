const seed = {
  name: "Section",
  data: require("../../../data/seed-local/seed-section.json"),
  tableNameBuilder: (stage) => `${stage}-section`,
  keys: ["pk", "sectionId"],
};

module.exports = seed;
