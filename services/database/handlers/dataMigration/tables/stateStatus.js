const query = `select state_id as "stateId", year, status, cas.program_type as "programType", cass.modified_by as "username", cass.modified_on as "lastChanged"
from carts_api_statestatus cass
join carts_api_state cas on cas.code = cass.state_id
where year <= 2021`;

const migration = {
  name: "State Status",
  query,
  transform: (rows) => {
    rows.map((row) => {
      row.lastChanged = row.lastChanged?.toString();
    });
    return rows;
  },
  tableNameBuilder: (stage) => `${stage}-state-status`,
  keys: ["stateId", "year"],
};

module.exports = migration;
