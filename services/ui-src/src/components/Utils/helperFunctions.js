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

export { sliceId, showQuestionByPath };
