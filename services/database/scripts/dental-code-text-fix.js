const { buildDynamoClient, scan, update } = require("./utils/dynamodb.js");

const isLocal = !!process.env.DYNAMODB_URL;
const sectionTableName = isLocal
  ? "localstack-section"
  : process.env.dynamoPrefix + "-section";

async function handler() {
  try {
    console.log("Start of data fix");

    buildDynamoClient();

    const scanParams = {
      TableName: sectionTableName,
      ExpressionAttributeNames: {
        "#year": "year",
        "#sectionId": "sectionId",
      },
      ExpressionAttributeValues: {
        ":year": 2023,
        ":sectionId": 3,
      },
      FilterExpression: "#year = :year AND #sectionId = :sectionId",
    };

    const existingItems = await scan(scanParams);
    const transformedItems = await transform(existingItems);
    await update(sectionTableName, transformedItems);

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

async function transform(items) {
  const transformed = items.map((item) => {
    const corrected = { ...item };

    // section 3, subsection g, questions 3 and 4 hints (array index 6 is question 4 because index 5 is conditional display)
    corrected.contents.section.subsections[6].parts[0].questions[4].hint =
      "The dental service must be provided by or under the supervision of a dentist as defined by HCPCS codes D1000–D1999 (or equivalent CDT codes D1000–D1999, or equivalent CPT codes) based on an unduplicated paid, unpaid, or denied claim.\n\nAll data should be based on the definitions in the Early and Periodic Screening, Diagnostic, and Treatment (EPSDT) Report (Form CMS-416).";
    corrected.contents.section.subsections[6].parts[0].questions[6].hint =
      "The dental service must be provided by or under the supervision of a dentist as defined by HCPCS codes D1000–D1999 (or equivalent CDT codes D1000–D1999, or equivalent CPT codes) based on an unduplicated paid, unpaid, or denied claim. \n All data should be based on the definitions in the Early and Periodic Screening, Diagnostic, and Treatment (EPSDT) Report (Form CMS-416).";

    return corrected;
  });

  return transformed;
}

handler();
