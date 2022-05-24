// This function extracts just the unique ID
// from all objectives & goals, stopping at the underscore

const sliceId = (id) => {
  const idString = id.toString();
  const num = idString.slice(idString.indexOf("_", idString.length - 1));
  return num;
};

// Set pageDisable based on location
// hide for print page
const showQuestionByPath = (path) => {
  let pageDisable = false;

  if (path === "/print") {
    pageDisable = true;
  }

  return pageDisable;
};

const generateQuestionNumber = (id) => {
  let labelBits = "";

  if (id) {
    const lastHunk = Number.parseInt(id.substring(id.length - 2), 10);
    if (Number.isNaN(lastHunk)) {
      const numberBit = Number.parseInt(
        id.substring(id.length - 4, id.length - 2),
        10
      );
      labelBits = `${numberBit}${id.substring(id.length - 1)}. `;
    } else {
      labelBits = `${lastHunk}. `;
    }
  }

  return labelBits;
};

export { sliceId, showQuestionByPath, generateQuestionNumber };
