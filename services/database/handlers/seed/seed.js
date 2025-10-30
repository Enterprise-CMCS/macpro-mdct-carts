/**
 * Custom handler for seeding deployed environments with required data.
 * Simple functionality to add required section base templates to each branch
 *
 * @param {*} event
 * @param {*} context
 * @param {*} callback
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function myHandler(event, context, callback) {
  // eslint-disable-next-line no-console
  console.log("Seeding Tables");

  const buildRunner = require("./services/seedRunner");
  const seedRunner = buildRunner();
  let data = [];

  const { tables } = require("./tables/index");
  data = data.concat(tables);

  if (process.env.seedTestData === "true") {
    // eslint-disable-next-line no-console
    console.log("Including test data");
    const { testTables } = require("./test-tables/index");
    data = data.concat(testTables);
  }

  for (const table of data) {
    await seedRunner.executeSeed(table);
  }

  // eslint-disable-next-line no-console
  console.log("Seed Finished");
}

exports.handler = myHandler;
