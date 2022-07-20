const query = `select contents->'section'->'year' as year, contents->'section'->'ordinal' as "sectionId", contents
from carts_api_sectionbase`;

const migration = {
  name: "Section Base",
  query,
  tableNameBuilder: (stage) => `${stage}-section-base`,
  keys: ["sectionId", "year"],
};

module.exports = migration;
