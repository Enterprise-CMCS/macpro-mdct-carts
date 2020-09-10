import jsonpath from "./jsonpath";

const hideIf = (state, hideIf) => {
  // Wil return the answer from associated question (Array)
  let associatedAnswer = jsonpath.query(state, hideIf.target);

  if (hideIf.values.interactive.includes(associatedAnswer[0])) {
    // If the associated answer IS in the interactive array, remove it
    return false;
  } else {
    // If the associated answer IS NOT in the interactive array, keep it
    return true;
  }
};

const hideIfAll = (state, hideIfAll) => {
  const associatedAnswers = hideIfAll.targets.map(target => jsonpath.query(state, target));
  console.log(associatedAnswers);

  return true;
};

/**
 * This function checks to see if a question should display based on an answer from a different question
 * @function shouldDisplay
 * @param {object} state - The application state from redux, the object required for jsonpath to query
 * @param {object} context - the context_data from a question
 * @returns {boolean} - determines if an element should be filtered out
 */
export const shouldDisplay = (state, context) => {
  if (!context || !context.conditional_display) {
    // if there is no context_data or if there is no conditional_display in the context_data object
    return true;
  }

  if (context.conditional_display.hide_if) {
    return hideIf(state, context.conditional_display.hide_if);
  }

  if (context.conditional_display.hide_if_all) {
    return hideIfAll(state, context.conditional_display.hide_if_all);
  }
};
