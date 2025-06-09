/* eslint-disable no-console */
/*
 * Local:
 *    DYNAMODB_URL="http://localhost:4566" year="2024" node services/database/scripts/create-contact-list.js
 *  Branch:
 *    dynamoPrefix="YOUR BRANCH NAME" year="2024" node services/database/scripts/create-contact-list.js
 */

const { buildDynamoClient, scan } = require("./utils/dynamodb.js");
const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = "output";
const isLocal = !!process.env.DYNAMODB_URL;

const sectionTableName = isLocal
  ? "localstack-section"
  : process.env.dynamoPrefix + "-section";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

const outputCsvFile = path.join(
  process.cwd(),
  OUTPUT_DIR,
  `${process.env.year}-contact-list.csv`
);

async function handler() {
  try {
    console.log(`Searching for ${process.env.year} modifications`);

    buildDynamoClient();

    console.log(`Processing table ${sectionTableName}`);
    const existingItems = await scan({ TableName: sectionTableName });
    const filteredItems = filter(existingItems);

    const transformedItems = transform(filteredItems);
    writeCsv(transformedItems, outputCsvFile);

    console.log(
      `CSV file generated at ${outputCsvFile} with ${transformedItems.length} records.`
    );

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

function filter(items) {
  return items.filter(
    (item) => item.sectionId === 0 && item.year === parseInt(process.env.year)
  );
}

function transform(items) {
  return items.map((item) => {
    const subsections = item.contents.section.subsections?.[0];
    const parts = subsections.parts?.[0];
    const { questions } = parts;

    const stateSection = questions.find(
      (q) => q.label === "State or territory name:"
    );
    const contactSection = questions.find(
      (q) =>
        q.label ===
        "Who should we contact if we have any questions about your report?"
    );

    const stateName = stateSection.answer.entry;
    const contactDetails = contactSection.questions;
    const contactName = contactDetails[0].answer.entry;
    const jobTitle = contactDetails[1].answer.entry;
    const email = contactDetails[2].answer.entry;
    const mailingAddress = contactDetails[3].answer.entry;
    const phoneNumber = contactDetails[4].answer.entry;

    return {
      stateName,
      contactName,
      jobTitle,
      email,
      mailingAddress,
      phoneNumber,
    };
  });
}

function writeCsv(data, filePath) {
  const headers = Object.keys(data[0]);

  const escapeValue = (value) => `"${String(value).replace(/"/g, '""')}"`;

  const rows = data.map((row) =>
    headers.map((header) => escapeValue(row[header]))
  );

  const csvContent = [
    headers.map(escapeValue).join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  fs.writeFileSync(filePath, csvContent, "utf8");
}

handler();
