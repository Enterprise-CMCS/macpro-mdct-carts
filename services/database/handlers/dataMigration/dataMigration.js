// eslint-disable-next-line no-unused-vars
async function myHandler(event, context, callback) {
  // eslint-disable-next-line no-console
  console.log("Beginning v2 Migration");

  const buildRunner = require("./services/migrationRunner");
  const migrationRunner = buildRunner();

  const { tables } = require("./tables/index");
  for (const table of tables) {
    await migrationRunner.executeMigration(table);
  }

  // eslint-disable-next-line no-console
  console.log("V2 Migration Finished");
}

exports.handler = myHandler;
