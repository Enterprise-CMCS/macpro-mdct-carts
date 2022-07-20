const query = `select state_id as "stateId", fiscal_year as "fiscalYear", "enhanced_FMAP" as "enhancedFmap"
               from carts_api_fmap`;

const migration = {
  name: "FMAP",
  query,
  tableNameBuilder: (stage) => `${stage}-fmap`,
  keys: ["stateId", "fiscalYear"],
};

module.exports = migration;
