const sectionData = [
  ...require("../../../data/seed/seed-section-base-2022.json"),
  ...require("../../../data/seed/seed-section-base-2023.json"),
];

const seed = {
  name: "Section Base",
  data: sectionData,
  tableNameBuilder: (stage) => `${stage}-section-base`,
  keys: ["sectionId", "year"],
};

module.exports = seed;
