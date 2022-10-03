const query = `select contents->'section'->'state' as "stateId", contents->'section'->'year' as year, contents->'section'->'ordinal' as "sectionId", modified_on as "lastChanged", contents
from carts_api_section`;

const migration = {
  name: "Sections",
  query,
  transform: (rows) => {
    rows.map((row) => {
      row.pk = `${row.stateId}-${row.year}`;
      row.lastChanged = row.lastChanged?.toString();
    });
    return rows;
  },
  tableNameBuilder: (stage) => `${stage}-section`,
  keys: ["pk", "sectionId"],
};

module.exports = migration;
