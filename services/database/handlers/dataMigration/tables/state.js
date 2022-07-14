const query = `select distinct on (code) code, name, program_type as programType from carts_api_state`;

const stateMigration = {
  name: "State Migration",
  query,
  transform: (rows) => {
    return rows.map((state) => ({
      name: state["name"],
      programType: state["program_type"],
      code: state["code"],
    }));
  },
  tableNameBuilder: (stage) => `${stage}-state`,
};

module.exports = stateMigration;
