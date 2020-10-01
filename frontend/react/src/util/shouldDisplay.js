import jsonpath from "./jsonpath";

/**
 * This function determines whether a radio's conditional subquestion should hide
 * @function hideIf
 * @param {object} state - The application state from redux, the object required for jsonpath to query
 * @param {object} hideIfInfo - the hide_if object from a question's context_data
 * @returns {boolean} - determines if an element should be filtered out, returning true hides a question
 */
const hideIf = (state, hideIfInfo) => {
  const targetAnswer = jsonpath.query(state, hideIfInfo.target)[0]; // User's selection from associated question
  const interactiveValues = hideIfInfo.values.interactive; // Array of values which if selected, should hide a question

  if (interactiveValues.includes(targetAnswer)) {
    // If the associated answer IS in the interactive array, remove it
    return true;
  }

  // If the associated answer IS NOT in the interactive array, keep it
  return false;
};

const hideIfAll = (state, hideIfAllInfo) => {
  const answers = hideIfAllInfo.values.interactive;
  return hideIfAllInfo.targets
    .map((target) => jsonpath.query(state, target)[0])
    .every((answer) => answers.includes(answer));
};

/**
 * This function determines whether a checkbox conditional subquestion should hide
 * @function hideIfNot
 * @param {object} state - The application state from redux, the object required for jsonpath to query
 * @param {object} hideIfNotInfo - the hide_if_not object from a question's context_data
 * @returns {boolean} - determines if an element should be filtered out, returning true hides a question
 */
const hideIfNot = (state, hideIfNotInfo) => {
  const targetAnswer = jsonpath.query(state, hideIfNotInfo.target)[0]; // Array of user selections from associated question
  const interactiveValues = hideIfNotInfo.values.interactive; // Array of values which if present in a user's selections, should hide a question

  const includedBoolean =
    targetAnswer === null
      ? true
      : !targetAnswer.some((val) => interactiveValues.indexOf(val) !== -1); // Returns false if any targetAnswer is present in the interactiveValues array

  return includedBoolean;
};

/**
 * This function checks to see if a question should display based on an answer from a different question
 * @function shouldDisplay
 * @param {object} state - The application state from redux, the object required for jsonpath to query
 * @param {object} context - the context_data from a question
 * @returns {boolean} - determines if an element should be filtered out, returning true means a question will display
 */
const shouldDisplay = (state, context) => {
  if (!context || !context.conditional_display) {
    // if there is no context_data or if there is no conditional_display in the context_data object
    return true;
  }

  // hide_if: there is just one target (question) with a single answer
  // displaying relies on that answer being incldued in the hide_if.values.interactive array
  if (context.conditional_display.hide_if) {
    return !hideIf(state, context.conditional_display.hide_if);
  }

  // hide_if_all, there is an array of targets (questions) that another question's display relies on
  if (context.conditional_display.hide_if_all) {
    return !hideIfAll(state, context.conditional_display.hide_if_all);
  }

  // hide_if_not, there is just one target (question) that may have multiple answers (checkbox)
  // displaying relies on that array of answers including any of the values from the hide_if_not.values.interactive array
  if (context.conditional_display.hide_if_not) {
    return !hideIfNot(state, context.conditional_display.hide_if_not);
  }

  // If we don't know what the heck is going on, just return true. Better to
  // display a question we shouldn't than not.
  return true;
};

export default shouldDisplay;

export { shouldDisplay };
