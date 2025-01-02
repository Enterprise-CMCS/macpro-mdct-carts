/* eslint-disable no-console */
/*
 * Local:
 *    `DYNAMODB_URL="http://localhost:8000" dynamoPrefix="local" node services/database/scripts/create-contact-list.js`
 *  Branch:
 *    dynamoPrefix="YOUR BRANCH NAME" node services/database/scripts/create-contact-list.js
 */

const { buildDynamoClient, scan } = require("./utils/dynamodb.js");
const fs = require("fs");
const path = require("path");

const isLocal = !!process.env.DYNAMODB_URL;

const sectionTableName = isLocal
  ? "local-section"
  : process.env.dynamoPrefix + "-section";
const outputCsvFile = path.resolve(__dirname, "2024-contact-list.csv");

async function handler() {
  try {
    console.log("Searching for 2024 modifications");

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
  return items.filter((item) => item.sectionId === 0 && item.year === 2024);
}

function transform(items) {
  return items.map((item) => {
    const subsections = item.contents.section.subsections?.[0];
    const parts = subsections.parts?.[0];
    const questions = parts.questions;

    const stateName = questions[0].answer.entry;
    const contactDetails = questions[3].questions;
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
