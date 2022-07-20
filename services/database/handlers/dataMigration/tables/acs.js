const query = `select state_id as "stateId", year, number_uninsured as "numberUninsured",  number_uninsured_moe as "numberUninsuredMoe",
                 percent_uninsured as "percentUninsured", percent_uninsured_moe as "percentUninsuredMoe"
               from carts_api_acs`;

const migration = {
  name: "ACS",
  query,
  tableNameBuilder: (stage) => `${stage}-acs`,
  keys: ["stateId", "year"],
};

module.exports = migration;
