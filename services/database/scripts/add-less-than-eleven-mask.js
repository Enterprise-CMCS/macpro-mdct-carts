/* eslint-disable no-console */
/*
 * Local:
 *    `DYNAMODB_URL="http://localhost:8000" dynamoPrefix="local" node services/database/scripts/add-less-than-eleven-mask.js`
 *  Branch:
 *    dynamoPrefix="YOUR BRANCH NAME" node services/database/scripts/add-less-than-eleven-mask.js
 */
const _ = require("lodash");

const { buildDynamoClient, scan, update } = require("./utils/dynamodb.js");

const isLocal = !!process.env.DYNAMODB_URL;

const sectionTable = isLocal
  ? "local-section"
  : process.env.dynamoPrefix + "-section";

let questionsUpdated = [];
let synthesizedTablesUpdated = [];
let synthesizedValuesUpdated = [];

const section3QuestionsToUpdate = {
  2021: [
    // 2021 Fields
    "2021-03-c-02-01",
    "2021-03-c-02-02",
    "2021-03-c-02-03",
    "2021-03-c-02-03-a",
    "2021-03-c-02-04",
    "2021-03-c-03-01",
    "2021-03-c-03-02",
    "2021-03-c-03-03",
    "2021-03-c-03-04",
    "2021-03-c-03-04-a",
    "2021-03-c-03-04-b",
    "2021-03-c-03-04-c",
    "2021-03-c-04-01",
    "2021-03-c-04-02",
    "2021-03-c-04-03",
    "2021-03-c-04-04",
    "2021-03-c-04-04-a",
    "2021-03-c-04-04-b",
    "2021-03-c-04-04-c",
    "2021-03-c-05-03-a",
    "2021-03-c-05-03-b",
    "2021-03-c-05-03-c",
    "2021-03-c-05-03-d",
    "2021-03-c-05-03-e",
    "2021-03-c-05-04-a",
    "2021-03-c-05-04-b",
    "2021-03-c-05-04-c",
    "2021-03-c-05-04-d",
    "2021-03-c-05-04-e",
    "2021-03-c-05-05-a",
    "2021-03-c-05-05-b",
    "2021-03-c-05-05-c",
    "2021-03-c-05-05-d",
    "2021-03-c-05-05-e",
    "2021-03-c-05-06-a",
    "2021-03-c-05-06-b",
    "2021-03-c-05-06-c",
    "2021-03-c-05-06-d",
    "2021-03-c-05-06-e",
    "2021-03-c-05-07-a",
    "2021-03-c-05-07-b",
    "2021-03-c-05-07-c",
    "2021-03-c-05-07-d",
    "2021-03-c-05-07-e",
    "2021-03-c-05-08-a",
    "2021-03-c-05-08-b",
    "2021-03-c-05-08-c",
    "2021-03-c-05-08-d",
    "2021-03-c-05-08-e",
    "2021-03-c-05-10-a",
    "2021-03-c-05-10-b",
    "2021-03-c-05-10-c",
    "2021-03-c-05-10-d",
    "2021-03-c-05-10-e",
    "2021-03-c-05-11-a",
    "2021-03-c-05-11-b",
    "2021-03-c-05-11-c",
    "2021-03-c-05-11-d",
    "2021-03-c-05-11-e",
    "2021-03-c-05-12-a",
    "2021-03-c-05-12-b",
    "2021-03-c-05-12-c",
    "2021-03-c-05-12-d",
    "2021-03-c-05-12-e",
    "2021-03-c-05-13-a",
    "2021-03-c-05-13-b",
    "2021-03-c-05-13-c",
    "2021-03-c-05-13-d",
    "2021-03-c-05-13-e",
    "2021-03-c-05-14-a",
    "2021-03-c-05-14-b",
    "2021-03-c-05-14-c",
    "2021-03-c-05-14-d",
    "2021-03-c-05-14-e",
    "2021-03-c-05-15-a",
    "2021-03-c-05-15-b",
    "2021-03-c-05-15-c",
    "2021-03-c-05-15-d",
    "2021-03-c-05-15-e",
    "2021-03-c-05-16-a",
    "2021-03-c-05-16-b",
    "2021-03-c-05-16-c",
    "2021-03-c-05-16-d",
    "2021-03-c-05-16-e",
    "2021-03-c-05-17-a",
    "2021-03-c-05-17-b",
    "2021-03-c-05-17-c",
    "2021-03-c-05-17-d",
    "2021-03-c-05-17-e",
    "2021-03-c-05-18-a",
    "2021-03-c-05-18-b",
    "2021-03-c-05-18-c",
    "2021-03-c-05-18-d",
    "2021-03-c-05-18-e",
    "2021-03-c-05-19-a",
    "2021-03-c-05-19-b",
    "2021-03-c-05-19-c",
    "2021-03-c-05-19-d",
    "2021-03-c-05-19-e",
    "2021-03-c-06-03-a",
    "2021-03-c-06-03-b",
    "2021-03-c-06-03-c",
    "2021-03-c-06-03-d",
    "2021-03-c-06-03-e",
    "2021-03-c-06-04-a",
    "2021-03-c-06-04-b",
    "2021-03-c-06-04-c",
    "2021-03-c-06-04-d",
    "2021-03-c-06-04-e",
    "2021-03-c-06-05-a",
    "2021-03-c-06-05-b",
    "2021-03-c-06-05-c",
    "2021-03-c-06-05-d",
    "2021-03-c-06-05-e",
    "2021-03-c-06-06-a",
    "2021-03-c-06-06-b",
    "2021-03-c-06-06-c",
    "2021-03-c-06-06-d",
    "2021-03-c-06-06-e",
    "2021-03-c-06-07-a",
    "2021-03-c-06-07-b",
    "2021-03-c-06-07-c",
    "2021-03-c-06-07-d",
    "2021-03-c-06-07-e",
    "2021-03-c-06-08-a",
    "2021-03-c-06-08-b",
    "2021-03-c-06-08-c",
    "2021-03-c-06-08-d",
    "2021-03-c-06-08-e",
    "2021-03-c-06-10-a",
    "2021-03-c-06-10-b",
    "2021-03-c-06-10-c",
    "2021-03-c-06-10-d",
    "2021-03-c-06-10-e",
    "2021-03-c-06-11-a",
    "2021-03-c-06-11-b",
    "2021-03-c-06-11-c",
    "2021-03-c-06-11-d",
    "2021-03-c-06-11-e",
    "2021-03-c-06-12-a",
    "2021-03-c-06-12-b",
    "2021-03-c-06-12-c",
    "2021-03-c-06-12-d",
    "2021-03-c-06-12-e",
    "2021-03-c-06-13-a",
    "2021-03-c-06-13-b",
    "2021-03-c-06-13-c",
    "2021-03-c-06-13-d",
    "2021-03-c-06-13-e",
    "2021-03-c-06-14-a",
    "2021-03-c-06-14-b",
    "2021-03-c-06-14-c",
    "2021-03-c-06-14-d",
    "2021-03-c-06-14-e",
    "2021-03-c-06-15-a",
    "2021-03-c-06-15-b",
    "2021-03-c-06-15-c",
    "2021-03-c-06-15-d",
    "2021-03-c-06-15-e",
    "2021-03-c-06-16-a",
    "2021-03-c-06-16-b",
    "2021-03-c-06-16-c",
    "2021-03-c-06-16-d",
    "2021-03-c-06-16-e",
    "2021-03-c-06-17-a",
    "2021-03-c-06-17-b",
    "2021-03-c-06-17-c",
    "2021-03-c-06-17-d",
    "2021-03-c-06-17-e",
    "2021-03-c-06-18-a",
    "2021-03-c-06-18-b",
    "2021-03-c-06-18-c",
    "2021-03-c-06-18-d",
    "2021-03-c-06-18-e",
    "2021-03-c-06-19-a",
    "2021-03-c-06-19-b",
    "2021-03-c-06-19-c",
    "2021-03-c-06-19-d",
    "2021-03-c-06-19-e",
    "2021-03-f-01-06",
    "2021-03-f-01-07",
    "2021-03-f-01-12",
    "2021-03-f-01-13",
    "2021-03-g-01-02-a",
    "2021-03-g-01-02-b",
    "2021-03-g-01-02-c",
    "2021-03-g-01-02-d",
    "2021-03-g-01-02-e",
    "2021-03-g-01-02-f",
    "2021-03-g-01-02-g",
    "2021-03-g-01-03-a",
    "2021-03-g-01-03-b",
    "2021-03-g-01-03-c",
    "2021-03-g-01-03-d",
    "2021-03-g-01-03-e",
    "2021-03-g-01-03-f",
    "2021-03-g-01-03-g",
    "2021-03-g-01-04-a",
    "2021-03-g-01-04-b",
    "2021-03-g-01-04-c",
    "2021-03-g-01-04-d",
    "2021-03-g-01-04-e",
    "2021-03-g-01-04-f",
    "2021-03-g-01-04-g",
    "2021-03-g-01-05-a",
    "2021-03-g-01-05-b",
    "2021-03-g-01-05-c",
    "2021-03-g-01-05-d",
    "2021-03-g-01-05-e",
    "2021-03-g-01-05-f",
    "2021-03-g-01-05-g",
    "2021-03-g-01-06",
    "2021-03-i-02-01-01-04",
    "2021-03-i-02-01-01-05",
  ],
  2020: [
    // 2020 Fields
    "2020-03-c-02-01",
    "2020-03-c-02-02",
    "2020-03-c-02-03",
    "2020-03-c-02-03-a",
    "2020-03-c-02-04",
    "2020-03-c-03-01",
    "2020-03-c-03-02",
    "2020-03-c-03-03",
    "2020-03-c-03-04",
    "2020-03-c-03-04-a",
    "2020-03-c-03-04-b",
    "2020-03-c-03-04-c",
    "2020-03-c-04-01",
    "2020-03-c-04-02",
    "2020-03-c-04-03",
    "2020-03-c-04-04",
    "2020-03-c-04-04-a",
    "2020-03-c-04-04-b",
    "2020-03-c-04-04-c",
    "2020-03-c-05-03-a",
    "2020-03-c-05-03-b",
    "2020-03-c-05-03-c",
    "2020-03-c-05-03-d",
    "2020-03-c-05-03-e",
    "2020-03-c-05-04-a",
    "2020-03-c-05-04-b",
    "2020-03-c-05-04-c",
    "2020-03-c-05-04-d",
    "2020-03-c-05-04-e",
    "2020-03-c-05-05-a",
    "2020-03-c-05-05-b",
    "2020-03-c-05-05-c",
    "2020-03-c-05-05-d",
    "2020-03-c-05-05-e",
    "2020-03-c-05-06-a",
    "2020-03-c-05-06-b",
    "2020-03-c-05-06-c",
    "2020-03-c-05-06-d",
    "2020-03-c-05-06-e",
    "2020-03-c-05-07-a",
    "2020-03-c-05-07-b",
    "2020-03-c-05-07-c",
    "2020-03-c-05-07-d",
    "2020-03-c-05-07-e",
    "2020-03-c-05-08-a",
    "2020-03-c-05-08-b",
    "2020-03-c-05-08-c",
    "2020-03-c-05-08-d",
    "2020-03-c-05-08-e",
    "2020-03-c-05-10-a",
    "2020-03-c-05-10-b",
    "2020-03-c-05-10-c",
    "2020-03-c-05-10-d",
    "2020-03-c-05-10-e",
    "2020-03-c-05-11-a",
    "2020-03-c-05-11-b",
    "2020-03-c-05-11-c",
    "2020-03-c-05-11-d",
    "2020-03-c-05-11-e",
    "2020-03-c-05-12-a",
    "2020-03-c-05-12-b",
    "2020-03-c-05-12-c",
    "2020-03-c-05-12-d",
    "2020-03-c-05-12-e",
    "2020-03-c-05-13-a",
    "2020-03-c-05-13-b",
    "2020-03-c-05-13-c",
    "2020-03-c-05-13-d",
    "2020-03-c-05-13-e",
    "2020-03-c-05-14-a",
    "2020-03-c-05-14-b",
    "2020-03-c-05-14-c",
    "2020-03-c-05-14-d",
    "2020-03-c-05-14-e",
    "2020-03-c-05-15-a",
    "2020-03-c-05-15-b",
    "2020-03-c-05-15-c",
    "2020-03-c-05-15-d",
    "2020-03-c-05-15-e",
    "2020-03-c-05-16-a",
    "2020-03-c-05-16-b",
    "2020-03-c-05-16-c",
    "2020-03-c-05-16-d",
    "2020-03-c-05-16-e",
    "2020-03-c-05-17-a",
    "2020-03-c-05-17-b",
    "2020-03-c-05-17-c",
    "2020-03-c-05-17-d",
    "2020-03-c-05-17-e",
    "2020-03-c-05-18-a",
    "2020-03-c-05-18-b",
    "2020-03-c-05-18-c",
    "2020-03-c-05-18-d",
    "2020-03-c-05-18-e",
    "2020-03-c-05-19-a",
    "2020-03-c-05-19-b",
    "2020-03-c-05-19-c",
    "2020-03-c-05-19-d",
    "2020-03-c-05-19-e",
    "2020-03-c-06-03-a",
    "2020-03-c-06-03-b",
    "2020-03-c-06-03-c",
    "2020-03-c-06-03-d",
    "2020-03-c-06-03-e",
    "2020-03-c-06-04-a",
    "2020-03-c-06-04-b",
    "2020-03-c-06-04-c",
    "2020-03-c-06-04-d",
    "2020-03-c-06-04-e",
    "2020-03-c-06-05-a",
    "2020-03-c-06-05-b",
    "2020-03-c-06-05-c",
    "2020-03-c-06-05-d",
    "2020-03-c-06-05-e",
    "2020-03-c-06-06-a",
    "2020-03-c-06-06-b",
    "2020-03-c-06-06-c",
    "2020-03-c-06-06-d",
    "2020-03-c-06-06-e",
    "2020-03-c-06-07-a",
    "2020-03-c-06-07-b",
    "2020-03-c-06-07-c",
    "2020-03-c-06-07-d",
    "2020-03-c-06-07-e",
    "2020-03-c-06-08-a",
    "2020-03-c-06-08-b",
    "2020-03-c-06-08-c",
    "2020-03-c-06-08-d",
    "2020-03-c-06-08-e",
    "2020-03-c-06-10-a",
    "2020-03-c-06-10-b",
    "2020-03-c-06-10-c",
    "2020-03-c-06-10-d",
    "2020-03-c-06-10-e",
    "2020-03-c-06-11-a",
    "2020-03-c-06-11-b",
    "2020-03-c-06-11-c",
    "2020-03-c-06-11-d",
    "2020-03-c-06-11-e",
    "2020-03-c-06-12-a",
    "2020-03-c-06-12-b",
    "2020-03-c-06-12-c",
    "2020-03-c-06-12-d",
    "2020-03-c-06-12-e",
    "2020-03-c-06-13-a",
    "2020-03-c-06-13-b",
    "2020-03-c-06-13-c",
    "2020-03-c-06-13-d",
    "2020-03-c-06-13-e",
    "2020-03-c-06-14-a",
    "2020-03-c-06-14-b",
    "2020-03-c-06-14-c",
    "2020-03-c-06-14-d",
    "2020-03-c-06-14-e",
    "2020-03-c-06-15-a",
    "2020-03-c-06-15-b",
    "2020-03-c-06-15-c",
    "2020-03-c-06-15-d",
    "2020-03-c-06-15-e",
    "2020-03-c-06-16-a",
    "2020-03-c-06-16-b",
    "2020-03-c-06-16-c",
    "2020-03-c-06-16-d",
    "2020-03-c-06-16-e",
    "2020-03-c-06-17-a",
    "2020-03-c-06-17-b",
    "2020-03-c-06-17-c",
    "2020-03-c-06-17-d",
    "2020-03-c-06-17-e",
    "2020-03-c-06-18-a",
    "2020-03-c-06-18-b",
    "2020-03-c-06-18-c",
    "2020-03-c-06-18-d",
    "2020-03-c-06-18-e",
    "2020-03-c-06-19-a",
    "2020-03-c-06-19-b",
    "2020-03-c-06-19-c",
    "2020-03-c-06-19-d",
    "2020-03-c-06-19-e",
    "2020-03-f-01-06",
    "2020-03-f-01-07",
    "2020-03-f-01-12",
    "2020-03-f-01-13",
    "2020-03-g-01-02-a",
    "2020-03-g-01-02-b",
    "2020-03-g-01-02-c",
    "2020-03-g-01-02-d",
    "2020-03-g-01-02-e",
    "2020-03-g-01-02-f",
    "2020-03-g-01-02-g",
    "2020-03-g-01-03-a",
    "2020-03-g-01-03-b",
    "2020-03-g-01-03-c",
    "2020-03-g-01-03-d",
    "2020-03-g-01-03-e",
    "2020-03-g-01-03-f",
    "2020-03-g-01-03-g",
    "2020-03-g-01-04-a",
    "2020-03-g-01-04-b",
    "2020-03-g-01-04-c",
    "2020-03-g-01-04-d",
    "2020-03-g-01-04-e",
    "2020-03-g-01-04-f",
    "2020-03-g-01-04-g",
    "2020-03-g-01-05-a",
    "2020-03-g-01-05-b",
    "2020-03-g-01-05-c",
    "2020-03-g-01-05-d",
    "2020-03-g-01-05-e",
    "2020-03-g-01-05-f",
    "2020-03-g-01-05-g",
    "2020-03-g-01-06",
    "2020-03-i-02-01-01-04",
    "2020-03-i-02-01-01-05",
  ],
};

const section3TablesToUpdate = {
  2021: [
    {
      hint: "This table is auto-populated with the data you entered above.",
      label: "Table: CHIP Eligibility Denials (Not Redetermination)",
      column: 1,
    },
    {
      hint: "These tables are auto-populated with the data you entered above.",
      label: "Table: Redetermination in CHIP ",
      column: 1,
    },
    {
      comment:
        "This is assuming that we make the user manually enter the answer to question 4; otherwise we don't currently have a way to support this functionality; see the comment on question 4 above.",
      label: "Table: Disenrollment in CHIP after Redetermination",
      column: 1,
    },
    {
      hint: "These tables are auto-populated with the data you entered above.",
      label: "Table: Redetermination in Medicaid ",
      column: 1,
    },
    {
      comment:
        "This is assuming that we make the user manually enter the answer to question 4; otherwise we don't currently have a way to support this functionality; see the comment on question 4 above.",
      label: "Table: Disenrollment in Medicaid after Redetermination",
      column: 1,
    },
  ],
  2020: [
    {
      hint: "This table is auto-populated with the data you entered above.",
      label: "Table: CHIP Eligibility Denials (Not Redetermination)",
      column: 1,
    },
    {
      hint: "These tables are auto-populated with the data you entered above.",
      label: "Table: Redetermination in CHIP ",
      column: 1,
    },
    {
      comment:
        "This is assuming that we make the user manually enter the answer to question 4; otherwise we don't currently have a way to support this functionality; see the comment on question 4 above.",
      label: "Table: Disenrollment in CHIP after Redetermination",
      column: 1,
    },
    {
      hint: "These tables are auto-populated with the data you entered above.",
      label: "Table: Redetermination in Medicaid ",
      column: 1,
    },
    {
      comment:
        "This is assuming that we make the user manually enter the answer to question 4; otherwise we don't currently have a way to support this functionality; see the comment on question 4 above.",
      label: "Table: Disenrollment in Medicaid after Redetermination",
      column: 1,
    },
  ],
};

const section3ValuesToUpdate = {
  2021: [
    {
      hint: "The answer to 4 should be equal to the sum of a, b, and c below: ",
      targets: [
        "$..*[?(@ && @.id=='2021-03-c-03-04-a')].answer.entry",
        "$..*[?(@ && @.id=='2021-03-c-03-04-b')].answer.entry",
        "$..*[?(@ && @.id=='2021-03-c-03-04-c')].answer.entry",
      ],
    },
    {
      hint: "The answer to 4 should be equal to the sum of a, b, and c below: ",
      targets: [
        "$..*[?(@ && @.id=='2021-03-c-04-04-a')].answer.entry",
        "$..*[?(@ && @.id=='2021-03-c-04-04-b')].answer.entry",
        "$..*[?(@ && @.id=='2021-03-c-04-04-c')].answer.entry",
      ],
    },
  ],
  2020: [
    {
      hint: "The answer to 4 should be equal to the sum of a, b, and c below: ",
      targets: [
        "$..*[?(@ && @.id=='2020-03-c-03-04-a')].answer.entry",
        "$..*[?(@ && @.id=='2020-03-c-03-04-b')].answer.entry",
        "$..*[?(@ && @.id=='2020-03-c-03-04-c')].answer.entry",
      ],
    },
    {
      hint: "The answer to 4 should be equal to the sum of a, b, and c below: ",
      targets: [
        "$..*[?(@ && @.id=='2020-03-c-04-04-a')].answer.entry",
        "$..*[?(@ && @.id=='2020-03-c-04-04-b')].answer.entry",
        "$..*[?(@ && @.id=='2020-03-c-04-04-c')].answer.entry",
      ],
    },
  ],
};

const section4QuestionsToUpdate = {
  2021: [
    // 2020 Fields
    "2021-04-a-01-01-01-02-01-04",
    "2021-04-a-01-01-01-02-01-06",
    "2021-04-a-01-01-02-02-01-04",
    "2021-04-a-01-01-02-02-01-06",
    "2021-04-a-01-01-03-02-01-04",
    "2021-04-a-01-01-03-02-01-06",
    "2021-04-a-01-01-04-02-01-04",
    "2021-04-a-01-01-04-02-01-06",
    "2021-04-a-01-01-05-02-01-04",
    "2021-04-a-01-01-05-02-01-06",
    "2021-04-a-01-01-06-02-01-04",
    "2021-04-a-01-01-06-02-01-06",
  ],
  2020: [
    // 2020 Fields
    "2020-04-a-01-01-01-02-01-04",
    "2020-04-a-01-01-01-02-01-06",
    "2020-04-a-01-01-02-02-01-04",
    "2020-04-a-01-01-02-02-01-06",
    "2020-04-a-01-01-03-02-01-04",
    "2020-04-a-01-01-03-02-01-06",
    "2020-04-a-01-01-04-02-01-04",
    "2020-04-a-01-01-04-02-01-06",
    "2020-04-a-01-01-05-02-01-04",
    "2020-04-a-01-01-05-02-01-06",
    "2020-04-a-01-01-06-02-01-04",
    "2020-04-a-01-01-06-02-01-06",
  ],
};

const section4TablesToUpdate = {
  2021: [],
  2020: [],
};

const section4ValuesToUpdate = {
  2021: [],
  2020: [],
};

const section5QuestionsToUpdate = {
  2021: [
    // 2020 Fields
    "2021-05-a-03-01-a",
    "2021-05-a-03-01-b",
    "2021-05-a-03-01-c",
    "2021-05-a-04-01-a",
    "2021-05-a-04-01-b",
    "2021-05-a-04-01-c",
  ],
  2020: [
    // 2020 Fields
    "2020-05-a-03-01-a",
    "2020-05-a-03-01-b",
    "2020-05-a-03-01-c",
    "2020-05-a-04-01-a",
    "2020-05-a-04-01-b",
    "2020-05-a-04-01-c",
  ],
};

const section5TablesToUpdate = {
  2021: [
    {
      row: 0,
      fieldset_info: {
        rows: [
          [
            {
              contents: "Eligible children",
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@ && @.id=='2021-05-a-03-01-a')].answer.entry"],
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@ && @.id=='2021-05-a-03-01-b')].answer.entry"],
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@ && @.id=='2021-05-a-03-01-c')].answer.entry"],
            },
          ],
          [
            { contents: "PMPM cost" },
            {
              actions: ["identity"],
              targets: ["$..*[?(@ && @.id=='2021-05-a-03-02-a')].answer.entry"],
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@ && @.id=='2021-05-a-03-02-b')].answer.entry"],
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@ && @.id=='2021-05-a-03-02-c')].answer.entry"],
            },
          ],
        ],
        headers: [
          { contents: "" },
          { contents: "FFY 2021" },
          { contents: "FFY 2022" },
          { contents: "FFY 2023" },
        ],
      },
    },
    {
      row: 0,
      fieldset_info: {
        rows: [
          [
            {
              contents: "Eligible children",
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@ && @.id=='2021-05-a-04-01-a')].answer.entry"],
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@ && @.id=='2021-05-a-04-01-b')].answer.entry"],
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@ && @.id=='2021-05-a-04-01-c')].answer.entry"],
            },
          ],
          [
            { contents: "PMPM cost" },
            {
              actions: ["identity"],
              targets: ["$..*[?(@ && @.id=='2021-05-a-04-02-a')].answer.entry"],
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@ && @.id=='2021-05-a-04-02-b')].answer.entry"],
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@ && @.id=='2021-05-a-04-02-c')].answer.entry"],
            },
          ],
        ],
        headers: [
          { contents: "" },
          { contents: "FFY 2021" },
          { contents: "FFY 2022" },
          { contents: "FFY 2023" },
        ],
      },
    },
  ],
  2020: [
    {
      row: 0,
      fieldset_info: {
        rows: [
          [
            {
              contents: "Eligible children",
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@ && @.id=='2020-05-a-03-01-a')].answer.entry"],
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@ && @.id=='2020-05-a-03-01-b')].answer.entry"],
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@ && @.id=='2020-05-a-03-01-c')].answer.entry"],
            },
          ],
          [
            { contents: "PMPM cost" },
            {
              actions: ["identity"],
              targets: ["$..*[?(@ && @.id=='2020-05-a-03-02-a')].answer.entry"],
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@ && @.id=='2020-05-a-03-02-b')].answer.entry"],
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@ && @.id=='2020-05-a-03-02-c')].answer.entry"],
            },
          ],
        ],
        headers: [
          { contents: "" },
          { contents: "FFY 2020" },
          { contents: "FFY 2021" },
          { contents: "FFY 2022" },
        ],
      },
    },
    {
      row: 0,
      fieldset_info: {
        rows: [
          [
            {
              contents: "Eligible children",
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@ && @.id=='2020-05-a-04-01-a')].answer.entry"],
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@ && @.id=='2020-05-a-04-01-b')].answer.entry"],
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@ && @.id=='2020-05-a-04-01-c')].answer.entry"],
            },
          ],
          [
            { contents: "PMPM cost" },
            {
              actions: ["identity"],
              targets: ["$..*[?(@ && @.id=='2020-05-a-04-02-a')].answer.entry"],
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@ && @.id=='2020-05-a-04-02-b')].answer.entry"],
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@ && @.id=='2020-05-a-04-02-c')].answer.entry"],
            },
          ],
        ],
        headers: [
          { contents: "" },
          { contents: "FFY 2020" },
          { contents: "FFY 2021" },
          { contents: "FFY 2022" },
        ],
      },
    },
  ],
};

const section5ValuesToUpdate = {
  2021: [],
  2020: [],
};

async function handler() {
  try {
    console.log("Searching for Sections 3, 4, and 5");

    buildDynamoClient();

    console.log(`Processing table ${sectionTable}`);
    const existingItems = await scan({
      TableName: sectionTable,
    });
    //Update Section 3
    const filteredSection3 = filter(existingItems, 3);
    const transformedSection3 = await transform(
      filteredSection3,
      section3QuestionsToUpdate,
      section3TablesToUpdate,
      section3ValuesToUpdate
    );
    await update(sectionTable, transformedSection3);
    console.log(
      `Touched ${transformedSection3.length} in table ${sectionTable} for section 3`
    );

    //Update Section 4
    const filteredSection4 = filter(existingItems, 4);
    const transformedSection4 = await transform(
      filteredSection4,
      section4QuestionsToUpdate,
      section4TablesToUpdate,
      section4ValuesToUpdate
    );
    await update(sectionTable, transformedSection4);
    console.log(
      `Touched ${transformedSection4.length} in table ${sectionTable} for section 4`
    );

    // Update Section 5
    const filteredSection5 = filter(existingItems, 5);
    const transformedSection5 = await transform(
      filteredSection5,
      section5QuestionsToUpdate,
      section5TablesToUpdate,
      section5ValuesToUpdate
    );
    await update(sectionTable, transformedSection5);
    console.log(
      `Touched ${transformedSection5.length} in table ${sectionTable} for section 5`
    );
    console.debug("Data fix complete");

    return {
      statusCode: 200,
      body: "All done!",
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: err.message,
    };
  }
}

function filter(items, sectionId) {
  return items.filter(
    (item) =>
      item.sectionId === sectionId && (item.year === 2023 || item.year === 2022)
  );
}

async function transform(
  items,
  questionsToUpdate,
  tablesToUpdate,
  valuesToUpdate
) {
  // Touch sync field only
  const transformed = items.map((section) => {
    console.log("Transforming section!", section);
    return findQuestionsToUpdate(
      section,
      questionsToUpdate[section.year],
      tablesToUpdate[section.year],
      valuesToUpdate[section.year]
    );
  });

  return transformed;
}

const findQuestionsToUpdate = (
  section,
  questionsToUpdate,
  tablesToUpdate,
  valuesToUpdate
) => {
  questionsUpdated = [];
  synthesizedTablesUpdated = [];
  synthesizedValuesUpdated = [];

  const copiedSection = section;

  copiedSection.contents.section.subsections.forEach((subsection) => {
    subsection.parts.forEach((part) => {
      recursivelyAddMaskToQuestions(
        part.questions,
        questionsToUpdate,
        tablesToUpdate,
        valuesToUpdate
      );
    });
  });

  //Double check all questions were updated as expected
  console.log("Updated Questions Count: ", questionsUpdated.length);
  console.log("Questions expected to be updated: ", questionsToUpdate.length);
  console.log(
    "Questions that weren't updated: ",
    questionsToUpdate.filter((x) => !questionsUpdated.includes(x))
  );
  if (questionsUpdated.length !== questionsToUpdate.length)
    console.log("Error! We didn't update all of the Questions correctly");
  console.log("-----");

  //Double check all synthesizedTables were updated as expected
  console.log("Updated Calculations Count: ", synthesizedTablesUpdated.length);
  console.log(
    "Synthesized Tables expected to be updated: ",
    tablesToUpdate.length
  );
  console.log(
    "Synthesized Tables that weren't updated: ",
    tablesToUpdate.filter((x) => !synthesizedTablesUpdated.includes(x))
  );
  if (synthesizedTablesUpdated.length !== tablesToUpdate.length)
    console.log("Error! We didn't update all of the Tables correctly");
  console.log("-----");

  //Double check all synthesizedValues were updated as expected
  console.log("Updated Calculations Count: ", synthesizedValuesUpdated.length);
  console.log(
    "Synthesized Values expected to be updated: ",
    valuesToUpdate.length
  );
  console.log(
    "Synthesized Values that weren't updated: ",
    valuesToUpdate.filter((x) => !synthesizedValuesUpdated.includes(x))
  );
  if (synthesizedValuesUpdated.length !== valuesToUpdate.length)
    console.log("Error! We didn't update all of the Values correctly");
  console.log("-----");

  return copiedSection;
};

const recursivelyAddMaskToQuestions = (
  questions,
  questionsToUpdate,
  synthesizedTablesToUpdate,
  synthesizedValuesToUpdated
) => {
  questions.forEach((question) => {
    if (questionsToUpdate.includes(question?.id)) {
      question.mask = "lessThanEleven";
      questionsUpdated.push(question.id);
    }

    if (question?.fieldset_type === "synthesized_table") {
      addMaskToSynthesizedTable(question, synthesizedTablesToUpdate);
    }
    if (question?.fieldset_type === "synthesized_value") {
      addMaskToSynthesizedValue(question, synthesizedValuesToUpdated);
    }

    if (question?.questions) {
      recursivelyAddMaskToQuestions(
        question.questions,
        questionsToUpdate,
        synthesizedTablesToUpdate,
        synthesizedValuesToUpdated
      );
    }
  });
};

const addMaskToSynthesizedTable = (question, synthesizedTablesToUpdate) => {
  let matchedCalculation;

  if (!question?.hint && !question?.label && !question?.comment) {
    //Handle Section 5
    matchedCalculation = synthesizedTablesToUpdate.find((calculation) =>
      _.isEqual(calculation?.fieldset_info, question?.fieldset_info)
    );
  } else {
    matchedCalculation = synthesizedTablesToUpdate.find(
      (calculation) =>
        calculation?.hint === question?.hint &&
        calculation?.label === question?.label &&
        calculation?.comment === question?.comment
    );
  }

  if (matchedCalculation) {
    if ("row" in matchedCalculation) {
      //Handle Section 5
      question.fieldset_info.rows[matchedCalculation.row].forEach((item) => {
        item.mask = "lessThanEleven";
      });
    } else {
      //Add the mask to the appropriate column
      question.fieldset_info.rows.forEach((row) => {
        row[matchedCalculation.column].mask = "lessThanEleven";
      });
      //Make sure the header column is hidden as well
      question.fieldset_info.headers[matchedCalculation.column].mask =
        "lessThanEleven";
    }

    //Safety count updated
    synthesizedTablesUpdated.push(matchedCalculation);
  }
};

const addMaskToSynthesizedValue = (question, synthesizedValuesToUpdated) => {
  const matchedCalculation = synthesizedValuesToUpdated.find(
    (calculation) =>
      calculation?.hint === question?.hint &&
      question?.fieldset_info?.targets.every((item) =>
        calculation.targets.includes(item)
      )
  );
  if (matchedCalculation) {
    question.fieldset_info.mask = "lessThanEleven";
    synthesizedValuesUpdated.push(matchedCalculation);
  }
};

handler();
