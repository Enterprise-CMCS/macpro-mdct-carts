import { selectFragmentById } from "../store/formData";
import jsonpath from "./jsonpath";
import {
  compareACS,
  lookupChipEnrollments,
  compareChipEnrollements,
} from "./synthesize";

/**
 * This function determines whether a radio's conditional subquestion should hide
 * @function hideIf
 * @param {object} state - The application state from redux, the object required for jsonpath to query
 * @param {object} hideIfInfo - the hide_if object from a question's context_data
 * @returns {boolean} - determines if an element should be filtered out, returning true hides a question
 */
const hideIf = (formData, hideIfInfo) => {
  const targetAnswer = jsonpath.query(formData, hideIfInfo.target)[0]; // User's selection from associated question
  const interactiveValues = hideIfInfo.values.interactive; // Array of values which if selected, should hide a question

  if (interactiveValues.includes(targetAnswer)) {
    // If the associated answer IS in the interactive array, remove it
    return true;
  }

  // If the associated answer IS NOT in the interactive array, keep it
  return false;
};

const hideIfAll = (formData, hideIfAllInfo) => {
  const answers = hideIfAllInfo.values.interactive;
  return hideIfAllInfo.targets
    .map((target) => jsonpath.query(formData, target)[0])
    .every((answer) => answers.includes(answer));
};

/**
 * This function determines whether a checkbox conditional subquestion should hide
 * @function hideIfNot
 * @param {object} state - The application state from redux, the object required for jsonpath to query
 * @param {object} hideIfNotInfo - the hide_if_not object from a question's context_data
 * @returns {boolean} - determines if an element should be filtered out, returning true hides a question
 */
const hideIfNot = (formData, hideIfNotInfo) => {
  const targetAnswer = jsonpath.query(formData, hideIfNotInfo.target)[0]; // Array of user selections from associated question
  const interactiveValues = hideIfNotInfo.values.interactive; // Array of values which if present in a user's selections, should hide a question

  const includedBoolean =
    targetAnswer === null
      ? true
      : !targetAnswer.some((val) => interactiveValues.indexOf(val) !== -1); // Returns false if any targetAnswer is present in the interactiveValues array

  return includedBoolean;
};

export const hideIfTableValue = (
  formData,
  allStatesData,
  stateUserAbbr,
  chipEnrollments,
  hideIfTableValueInfo
) => {
  // Get table values
  const targetValues = jsonpath.query(formData, hideIfTableValueInfo.target)[0];
  let computedValues = [];

  // If target needs to be calculated
  if (hideIfTableValueInfo.computed) {
    targetValues.forEach(() => {});
    for (const targetRow of targetValues) {
      const computedRow = [];
      for (const item of targetRow) {
        // get computed value via lookup function and push into a multidimensional array
        if (item.compareACS) {
          computedRow.push(
            compareACS(allStatesData, stateUserAbbr, item.compareACS)
          );
        } else if (item.lookupChipEnrollments) {
          computedRow.push(
            lookupChipEnrollments(chipEnrollments, item.lookupChipEnrollments)
          );
        } else if (item.compareChipEnrollements) {
          computedRow.push(
            compareChipEnrollements(
              chipEnrollments,
              item.compareChipEnrollements
            )
          );
        } else {
          // Let non-computed entries pass through with the other data transparently
          computedRow.push(item);
        }
      }
      computedValues.push(computedRow);
    }
    // Handle every entry in case we are calculating off of a table
  } else {
    computedValues = targetValues;
  }

  const { variations } = hideIfTableValueInfo;
  const variationOperator = hideIfTableValueInfo.variation_operator;

  const resultsArray = [];
  let result;

  // Loop through variations and check is threshold is met
  /* eslint-disable no-plusplus */
  for (let i = 0; i < variations.length; i++) {
    // Loop through table rows for matches
    /* eslint-disable no-plusplus */
    for (let j = 0; j < computedValues.length; j++) {
      // Check if current variation corresponds with targetValue row
      let rowValue;
      if (variations[i].row === "*") {
        rowValue = "*";
      } else {
        rowValue = parseFloat(variations[i].row, 10);
      }
      /* eslint-disable no-plusplus */
      if (rowValue === "*" || rowValue === j) {
        // get row key
        const rowKey = parseFloat(variations[i].row_key, 10);
        const threshold = parseFloat(variations[i].threshold, 10);
        const comparisonValue = parseFloat(computedValues[j][rowKey], 10);

        // Check if threshold is met
        switch (variations[i].operator) {
          case "<":
            if (comparisonValue < threshold) {
              resultsArray.push(true);
            } else {
              resultsArray.push(false);
            }
            break;
          case ">":
            if (comparisonValue > threshold) {
              resultsArray.push(true);
            } else {
              resultsArray.push(false);
            }
            break;
          case "=":
            if (comparisonValue === variations[i].threshold) {
              resultsArray.push(true);
            } else {
              resultsArray.push(false);
            }
            break;
          case "!=":
            if (comparisonValue !== variations[i].threshold) {
              resultsArray.push(true);
            } else {
              resultsArray.push(false);
            }
            break;
          default:
            resultsArray.push(false);
        }

        // Determine is variation_operator is true

        if (variationOperator === "or") {
          result = false;

          if (resultsArray.includes(true)) {
            result = true;
          }
        } else if (variationOperator === "and") {
          result = true;
          if (resultsArray.includes(false)) {
            result = false;
          }
        }
      }
    }
  }
  return result;
};

const PROGRAM_TYPE_QUESTION_ID = "-00-a-01-02";

const getProgramTypeFromForm = (formData, reportStatus) => {
  // attempt to find programType from same year as form
  const formYear = formData[0].year;
  const currentYearProgramType = selectFragmentById(
    formData,
    `${formYear}${PROGRAM_TYPE_QUESTION_ID}`
  )?.answer?.entry;
  if (currentYearProgramType) {
    return currentYearProgramType;
  }

  // attempt to find programType from the previous year's form, otherwise retrieve from status
  const previousYear = parseInt(formYear) - 1;
  const previousYearProgramType = selectFragmentById(
    formData,
    `${previousYear}${PROGRAM_TYPE_QUESTION_ID}`
  )?.answer?.entry;
  const reportStatusCode = formData[0].stateId + formData[0].year;
  const programFromStatus = reportStatus[reportStatusCode].programType;
  return previousYearProgramType || programFromStatus;
};

/**
 * This function checks to see if a question should display based on an answer from a different question
 * @function shouldDisplay
 * @param {object} state - The application state from redux, the object required for jsonpath to query
 * @param {object} context - the context_data from a question
 * @returns {boolean} - determines if an element should be filtered out, returning true means a question will display
 */
const shouldDisplay = (
  currentUserRole,
  formData,
  reportStatus,
  allStatesData,
  stateUserAbbr,
  chipEnrollments,
  context
) => {
  if (
    !context ||
    (!context.conditional_display && !context.show_if_state_program_type_in)
  ) {
    return true;
  }

  /*
   * show_if_state_program_type_in: there is an array of acceptable values
   * displaying relies on that answer being included in the show_if_state_program_type_in array
   */
  if (context.show_if_state_program_type_in) {
    const program = getProgramTypeFromForm(formData, reportStatus);
    return context.show_if_state_program_type_in.includes(program);
  }

  /*
   * hide_if: there is just one target (question) with a single answer
   * displaying relies on that answer being included in the hide_if.values.interactive array
   */
  if (context.conditional_display.hide_if) {
    return !hideIf(formData, context.conditional_display.hide_if);
  }

  // hide_if_all, there is an array of targets (questions) that another question's display relies on
  if (context.conditional_display.hide_if_all) {
    return !hideIfAll(formData, context.conditional_display.hide_if_all);
  }

  /*
   * hide_if_not, there is just one target (question) that may have multiple answers (checkbox)
   * displaying relies on that array of answers including any of the values from the hide_if_not.values.interactive array
   */
  if (context.conditional_display.hide_if_not) {
    return !hideIfNot(formData, context.conditional_display.hide_if_not);
  }

  /*
   * hide_if_table_value, there is one target table that may have multiple variations
   * displaying relies on variations supplied to return a bool is ANY are tru
   */
  if (context.conditional_display.hide_if_table_value) {
    return hideIfTableValue(
      formData,
      allStatesData,
      stateUserAbbr,
      chipEnrollments,
      context.conditional_display.hide_if_table_value
    );
  }

  /*
   * If we don't know what the heck is going on, just return true. Better to
   * display a question we shouldn't than not.
   */
  return true;
};

export default shouldDisplay;

export { shouldDisplay };
