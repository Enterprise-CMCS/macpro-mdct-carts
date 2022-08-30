const tables = [
  require("./acs"),
  require("./enrollmentCounts"),
  require("./fmap"),
  require("./section"),
  require("./state"),
  require("./stateStatus"),
];

module.exports = { testTables: tables };
