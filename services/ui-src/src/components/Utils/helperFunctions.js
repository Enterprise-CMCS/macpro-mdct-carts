/*
 * Set pageDisable based on location
 * hide for print page
 */
const showQuestionByPath = (path) => {
  let pageDisable = false;

  if (path === "/print") {
    pageDisable = true;
  }

  return pageDisable;
};

export { showQuestionByPath };
