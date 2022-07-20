const query = `select distinct on (code) code, name, program_type as "programType" 
                    from carts_api_state`;

const migration = {
  name: "State",
  query,
  tableNameBuilder: (stage) => `${stage}-state`,
  keys: ["code"],
};

module.exports = migration;
