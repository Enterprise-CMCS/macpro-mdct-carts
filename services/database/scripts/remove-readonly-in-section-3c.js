/* eslint-disable no-console */
/*
 * Local:
 *    DYNAMODB_URL="http://localhost:4566" node services/database/scripts/remove-readonly-in-section-3c.js
 *  Branch:
 *    dynamoPrefix="YOUR BRANCH NAME" node services/database/scripts/remove-readonly-in-section-3c.js
 */

const { buildDynamoClient, scan, update } = require("./utils/dynamodb.js");

const isLocal = !!process.env.DYNAMODB_URL;

const sectionTable = isLocal
  ? "localstack-section"
  : process.env.dynamoPrefix + "-section";

async function handler() {
  try {
    console.log("Searching for 2023 Forms");

    buildDynamoClient();

    console.log(`Processing table ${sectionTable}`);
    const existingItems = await scan({
      TableName: sectionTable,
    });
    const filteredItems = filter(existingItems);
    const transformedItems = await transform(filteredItems);
    await update(sectionTable, transformedItems);
    console.log(`Touched ${transformedItems.length} in table ${sectionTable}`);
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

function filter(items) {
  return items.filter((item) => item.year === 2023 && item.sectionId === 3);
}

async function transform(items) {
  // Touch sync field only
  const transformed = items.map((section) => {
    console.log("Transforming section!", section);
    return updateSection3(section);
  });

  return transformed;
}

const updateSection3 = (section) => {
  section.contents.section.subsections[2].parts.map((part) => {
    return recurseAndUpdateQuestions(part.questions, section.pk);
  });
  return section;
};

const recurseAndUpdateQuestions = (questions, reportBeingTransformed) => {
  const fieldstoRemoveReadonly = [
    "2023-03-c-05-19-a",
    "2023-03-c-06-10-a",
    "2023-03-c-06-11-a",
    "2023-03-c-06-12-a",
    "2023-03-c-06-13-a",
    "2023-03-c-06-14-a",
    "2023-03-c-06-15-a",
    "2023-03-c-06-16-a",
    "2023-03-c-06-17-a",
    "2023-03-c-06-18-a",
    "2023-03-c-06-19-a",
  ];
  for (let question of questions) {
    if (
      fieldstoRemoveReadonly.includes(question?.id) &&
      question?.answer?.readonly
    ) {
      console.log(
        reportBeingTransformed,
        "Found and deleting readonly field from question",
        question.id
      );
      delete question.answer.readonly;
    }
    if (question?.questions) {
      recurseAndUpdateQuestions(question.questions, reportBeingTransformed);
    }
  }
};

handler();
