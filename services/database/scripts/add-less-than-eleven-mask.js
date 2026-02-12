/*
 * Local:
 *    DYNAMODB_URL="http://localhost:4566" node services/database/scripts/add-less-than-eleven-mask.js
 *  Branch:
 *    dynamoPrefix="YOUR BRANCH NAME" node services/database/scripts/add-less-than-eleven-mask.js
 */
const _ = require("lodash");

const { buildDynamoClient, scan, update } = require("./utils/dynamodb.js");

const isLocal = !!process.env.DYNAMODB_URL;

const sectionTable = isLocal
  ? "localstack-section"
  : process.env.dynamoPrefix + "-section";

let questionsUpdated = [];
let synthesizedTablesUpdated = [];
let synthesizedValuesUpdated = [];

const section3QuestionsToUpdate = {
  2021: [],
  2020: [],
};

const section3TablesToUpdate = {
  2021: [],
  2020: [],
};

const section3ValuesToUpdate = {
  2021: [
    {
      hint: "The answer to 4 should be equal to the sum of a, b, and c below: ",
      targets: [
        "$..*[?(@.id=='2021-03-c-03-04-a')].answer.entry",
        "$..*[?(@.id=='2021-03-c-03-04-b')].answer.entry",
        "$..*[?(@.id=='2021-03-c-03-04-c')].answer.entry",
      ],
    },
    {
      hint: "The answer to 4 should be equal to the sum of a, b, and c below: ",
      targets: [
        "$..*[?(@.id=='2021-03-c-04-04-a')].answer.entry",
        "$..*[?(@.id=='2021-03-c-04-04-b')].answer.entry",
        "$..*[?(@.id=='2021-03-c-04-04-c')].answer.entry",
      ],
    },
  ],
  2020: [
    {
      hint: "The answer to 4 should be equal to the sum of a, b, and c below: ",
      targets: [
        "$..*[?(@.id=='2020-03-c-03-04-a')].answer.entry",
        "$..*[?(@.id=='2020-03-c-03-04-b')].answer.entry",
        "$..*[?(@.id=='2020-03-c-03-04-c')].answer.entry",
      ],
    },
    {
      hint: "The answer to 4 should be equal to the sum of a, b, and c below: ",
      targets: [
        "$..*[?(@.id=='2020-03-c-04-04-a')].answer.entry",
        "$..*[?(@.id=='2020-03-c-04-04-b')].answer.entry",
        "$..*[?(@.id=='2020-03-c-04-04-c')].answer.entry",
      ],
    },
  ],
};

const section4QuestionsToUpdate = {
  2021: [],
  2020: [],
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
  2021: [],
  2020: [],
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
              targets: ["$..*[?(@.id=='2021-05-a-03-01-a')].answer.entry"],
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@.id=='2021-05-a-03-01-b')].answer.entry"],
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@.id=='2021-05-a-03-01-c')].answer.entry"],
            },
          ],
          [
            { contents: "PMPM cost" },
            {
              actions: ["identity"],
              targets: ["$..*[?(@.id=='2021-05-a-03-02-a')].answer.entry"],
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@.id=='2021-05-a-03-02-b')].answer.entry"],
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@.id=='2021-05-a-03-02-c')].answer.entry"],
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
              targets: ["$..*[?(@.id=='2021-05-a-04-01-a')].answer.entry"],
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@.id=='2021-05-a-04-01-b')].answer.entry"],
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@.id=='2021-05-a-04-01-c')].answer.entry"],
            },
          ],
          [
            { contents: "PMPM cost" },
            {
              actions: ["identity"],
              targets: ["$..*[?(@.id=='2021-05-a-04-02-a')].answer.entry"],
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@.id=='2021-05-a-04-02-b')].answer.entry"],
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@.id=='2021-05-a-04-02-c')].answer.entry"],
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
              targets: ["$..*[?(@.id=='2020-05-a-03-01-a')].answer.entry"],
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@.id=='2020-05-a-03-01-b')].answer.entry"],
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@.id=='2020-05-a-03-01-c')].answer.entry"],
            },
          ],
          [
            { contents: "PMPM cost" },
            {
              actions: ["identity"],
              targets: ["$..*[?(@.id=='2020-05-a-03-02-a')].answer.entry"],
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@.id=='2020-05-a-03-02-b')].answer.entry"],
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@.id=='2020-05-a-03-02-c')].answer.entry"],
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
              targets: ["$..*[?(@.id=='2020-05-a-04-01-a')].answer.entry"],
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@.id=='2020-05-a-04-01-b')].answer.entry"],
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@.id=='2020-05-a-04-01-c')].answer.entry"],
            },
          ],
          [
            { contents: "PMPM cost" },
            {
              actions: ["identity"],
              targets: ["$..*[?(@.id=='2020-05-a-04-02-a')].answer.entry"],
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@.id=='2020-05-a-04-02-b')].answer.entry"],
            },
            {
              actions: ["identity"],
              targets: ["$..*[?(@.id=='2020-05-a-04-02-c')].answer.entry"],
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
      item.sectionId === sectionId && (item.year === 2021 || item.year === 2020)
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
