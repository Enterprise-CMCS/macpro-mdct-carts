import jsonpath from "./jsonpath";

const hideIf = (state, hideIf) => {
  // Wil return the answer from associated question (Array)
  let targetAnswer = jsonpath.query(state, hideIf.target);
  let answersArray = hideIf.values.interactive;

  // DELETE: targetAnswer for 2020-03-h-02-04 will be , ["none", "other"]
  //DELETE: targetAnswer for any other question will be ["someEntry"]
  // So for any other question we could consistently just call the thing at the zeroth index

  // Short version
  // let includedBoolean = targetAnswer.some(
  //   (val) => answersArray.indexOf(val) !== -1
  // );

  let includedBoolean = false;

  for (let i = 0; i < targetAnswer.length; i++) {
    let singleAnswer = targetAnswer[i];
    if (answersArray.includes(singleAnswer)) {
      includedBoolean = true;
      break;
    }
  }
  return includedBoolean;

  // if (includedBoolean === true) {
  //   // If the target answer IS in the interactive array, remove it
  //   return includedBoolean
  // } else {
  //   // If the target answer IS NOT in the interactive array, keep it
  //   return false;
  // }

  // if (hideIf.values.interactive.includes(targetAnswer[0])) {
  //   // If the associated answer IS in the interactive array, remove it
  //   return true;
  // } else {docker
  //   // If the associated answer IS NOT in the interactive array, keep it
  //   return false;
  // }
};

const hideIfAll = (state, hideIfAll) => {
  const answers = hideIfAll.values.interactive;
  return hideIfAll.targets
    .map((target) => jsonpath.query(state, target)[0])
    .every((answer) => answers.includes(answer));
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

  // hide_if, there is just one target (question) that a single question's display relies on
  if (context.conditional_display.hide_if) {
    return !hideIf(state, context.conditional_display.hide_if);
  }

  // hide_if_all, there is an array of targets (questions) that a single question's display relies on
  if (context.conditional_display.hide_if_all) {
    return !hideIfAll(state, context.conditional_display.hide_if_all);
  }
};
