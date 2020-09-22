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

const hideIfNot = (state, hideIfNot) => {
  let targetAnswer = jsonpath.query(state, hideIfNot.target);
  let interactiveValues = hideIfNot.values.interactive;

  // TargetAnswer, [‘other’] OR [null] OR [‘other’, ‘ccc’]
  // Values, interactive: [‘other’] HIDE IF NOT FOUND IN TARGET.
  // Values, noninteractive: [‘other’]
  // Hide if interactive values NOT found in target

  // before we would say, hide if IV includes TA
  // Now we want to say, hide if TA (array) does NOT include IV
  //                also, hide if TA is null
  // Return TRUE and it will be REMOVED

  // Short version
  // let includedBoolean = targetAnswer.some(
  //   (val) => answersArray.indexOf(val) !== -1
  // );

  let includedBoolean =
    targetAnswer === null
      ? false
      : interactiveValues.some((val) => targetAnswer.indexOf(val) !== -1);

  // let includedBoolean = false;

  // if (targetAnswer === null) {
  //   return includedBoolean;
  // } else {
  //   for (let i = 0; i < interactiveValues.length; i++) {
  //     let singleAnswer = interactiveValues[i];
  //     if (targetAnswer.includes(singleAnswer)) {
  //       includedBoolean = true;
  //       break;
  //     }
  //   }
  // }

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
