const query = `select contents->'section'->'id' as "pk", contents->'section'->'year' as year, contents->'section'->'ordinal' as "sectionId", contents
from carts_api_section`;

const migration = {
  name: "Sections",
  query,
  tableNameBuilder: (stage) => `${stage}-section`,
  keys: ["pk", "sectionId"],
};

module.exports = migration;
