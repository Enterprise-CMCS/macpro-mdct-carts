import jsonpath from "./jsonpath";

const hideIf = (state, hideIf) => {
  // Wil return the answer from associated question (Array)
  let targetAnswer = jsonpath.query(state, hideIf.target)[0];
  let answersArray = hideIf.values.interactive;

  if (answersArray.includes(targetAnswer)) {
    // If the associated answer IS in the interactive array, remove it
    return true;
  } else {
    // If the associated answer IS NOT in the interactive array, keep it
    return false;
  }
};

const hideIfAll = (state, hideIfAll) => {
  const answers = hideIfAll.values.interactive;
  return hideIfAll.targets
    .map((target) => jsonpath.query(state, target)[0])
    .every((answer) => answers.includes(answer));
};

const hideIfNot = (state, hideIfNot) => {
  let targetAnswer = jsonpath.query(state, hideIfNot.target)[0];
  let interactiveValues = hideIfNot.values.interactive;

  // TargetAnswer, [‘other’] OR [null] OR [‘other’, ‘ccc’]
  // Values, interactive: [‘other’]

  const someHelperFunction = () => {
    let anyMatches = targetAnswer.some(
      (val) => interactiveValues.indexOf(val) !== -1 //Returns true if any targetAnswer is present in the interactiveValues array
    );
    if (anyMatches === true) {
      return false; // returning false means the question will not be removed from rendering
    }
    return true; // returning true means the question will be removed from rendering
  };

  let includedBoolean = targetAnswer === null ? true : someHelperFunction();

  // WANT, if targetAnswer includes val, return FALSE

  // This function should return TRUE to... remove
  // This function should return FALSE to... keep
  return includedBoolean;
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
};
