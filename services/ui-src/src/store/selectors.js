import jsonpath from "../util/jsonpath";
import { REPORT_STATUS, AppRoles } from "../types";
import { selectFragment } from "./formData"; // eslint-disable-line
import { shouldDisplay } from "../util/shouldDisplay";
import statesArray from "../components/utils/statesArray";

export const selectById = (state, id) => {
  const jspath = `$..formData[*].contents..*[?(@ && @.id==='${id}')]`;
  const item = jsonpath.query(state, jspath);

  if (item.length) {
    return item[0];
  }
  return null;
};

export const selectSectionTitle = (state, sectionId) => {
  const jspath = `$..formData[*].contents.section[?(@ && @.id=='${sectionId}')].title`;
  const sectionTitles = jsonpath.query(state, jspath);

  if (sectionTitles.length) {
    return sectionTitles[0];
  }
  return null;
};

export const selectSubsectionTitleAndPartIDs = (formData, subsectionId) => {
  const subsection = selectFragment(formData, subsectionId);

  if (subsection) {
    return {
      parts: subsection.parts.map((part) => part.id),
      title: subsection.title,
      text: subsection.text,
    };
  }
  return null;
};

export const selectQuestion = (state, id) => {
  const jp = `$..[*].contents.section.subsections[*].parts[*]..questions[?(@ && @.id=='${id}')]`;
  const questions = jsonpath.query(state, jp);
  if (questions.length) {
    return questions[0];
  }

  return null;
};

/**
 * This function is a callback for the filter method in selectQuestionsForPart
 * @function filterDisplay
 * @param {object} question - single question from the unfilteredData array in selectQuestionsForPart.
 * @param {object} currentUserRole - The role of the current user. Accessed at state.currentUser.role
 * @returns {boolean} - to be evaluated by the filter method
 */
const filterDisplay = (
  question,
  currentUserRole,
  formData,
  reportStatus,
  allStatesData,
  stateUserAbbr,
  chipEnrollments
) => {
  if (
    !shouldDisplay(
      currentUserRole,
      formData,
      reportStatus,
      allStatesData,
      stateUserAbbr,
      chipEnrollments,
      question.context_data
    )
  ) {
    // If context data and a variation of skip text exists
    if (
      question.context_data &&
      ((question.context_data.conditional_display &&
        question.context_data.conditional_display.skip_text) ||
        question.context_data.skip_text)
    ) {
      // Set skip_text based on location in JSON
      let skipText = "";
      if (
        question.context_data.conditional_display &&
        question.context_data.conditional_display.skip_text
      ) {
        skipText = question.context_data.conditional_display.skip_text;
      } else {
        skipText = question.context_data.skip_text;
      }

      return {
        id: question.id,
        type: "skip_text",
        skip_text: skipText,
      };
    }
    return false; // return false to exclude this question from filtered array
  }

  if (question.questions && question.questions.length > 0) {
    // if the current question has subquestions, filter them recursively
    question.questions = question.questions
      .map((singleQuestion) => {
        // reassign question.questions to be a filtered version of itself
        return filterDisplay(
          singleQuestion,
          currentUserRole,
          formData,
          reportStatus,
          allStatesData,
          stateUserAbbr,
          chipEnrollments
        );
      })
      .filter((q) => q !== false);
  }
  return question; // default for any questions that pass should display
};

// Returns an array of questions for the QuestionComponent to map through
export const selectQuestionsForPart = (
  formData,
  currentUserRole,
  reportStatus,
  allStatesData,
  stateUserAbbr,
  chipEnrollments,
  partId
) => {
  const jp = `$..[*].contents.section.subsections[*].parts[?(@ && @.id=='${partId}')].questions[*]`;
  const unfilteredData = JSON.parse(
    JSON.stringify(jsonpath.query(formData, jp))
  );

  // Filter the array of questions based on conditional logic
  const filteredQuestions = unfilteredData
    .map((question) => {
      return filterDisplay(
        question,
        currentUserRole,
        formData,
        reportStatus,
        allStatesData,
        stateUserAbbr,
        chipEnrollments
      );
    })
    .filter((q) => q !== false);

  return filteredQuestions;
};

export const selectSectionsForNav = (formData) => {
  if (formData) {
    return formData.map(
      ({
        contents: {
          section: { id, ordinal, subsections, title },
        },
      }) => ({
        id,
        ordinal,
        title,
        subsections: subsections.map(({ id, title }) => ({ id, title })), // eslint-disable-line no-shadow
      })
    );
  }
  return [];
};

/**
 * Get the Status for the current report.
 * @param {object} reportStatus - the current report status object stored in state
 * @param {object} formData - The current form object stored in state
 * @param {object} stateUser - The current user object stored in state
 * @param {object} formYear - The form year currently stored in global state.
 * @returns {object} The reportStatus object associated with the current report
 */
export const getCurrentReportStatus = (
  reportStatus,
  formData,
  stateUser,
  formYear
) => {
  let currentReport = "";
  if (stateUser.currentUser.role === AppRoles.STATE_USER) {
    currentReport = `${stateUser.abbr}${formYear}`;
  } else {
    if (formData?.[0] === undefined) return {};
    currentReport = `${formData[0].stateId}${formData[0].year}`;
  }

  const status = reportStatus[currentReport];
  return status || {};
};

/**
 * Get the Status for the current report.
 * @param {object} reportStatus - the current report status object stored in state
 * @param {object} formData - The current form object stored in state
 * @param {object} stateUser - The current user object stored in state
 * @param {object} formYear - Global variables that will be the same regardless of users
 * @returns {object} The reportStatus object associated with the current report
 */
export const selectIsFormEditable = (
  reportStatus,
  formData,
  stateUser,
  formYear
) => {
  const { role } = stateUser.currentUser;
  const { status } = getCurrentReportStatus(
    reportStatus,
    formData,
    stateUser,
    formYear
  );

  switch (status) {
    case REPORT_STATUS.not_started:
    case REPORT_STATUS.in_progress:
    case REPORT_STATUS.uncertified:
    case undefined:
      /*
       * Forms can only be edited if the current user is a state user AND the
       * form is in one of the statuses above.
       */
      return role === AppRoles.STATE_USER;
    default:
      return false;
  }
};

export const { selectFormStatus, selectFormStatuses } = (() => {
  return {
    selectFormStatus: (state) => {
      const { status } = state.reportStatus;
      return status;
    },
    selectFormStatuses: (state) => {
      let returnObject = [];

      const allReportStatuses = Object.entries(state.reportStatus);

      // This is the default value so when the page loads before the records are populated, it will crash without this check
      if (
        allReportStatuses.length > 0 &&
        allReportStatuses[0][0] !== "status"
      ) {
        returnObject = Object.entries(state.reportStatus).map(
          // eslint-disable-next-line
          ([{}, { status, year, stateCode, lastChanged, username }]) => ({
            state: statesArray.find(({ value }) => value === stateCode)?.label,
            stateCode,
            status,
            year,
            lastChanged,
            username,
          })
        );
      } else {
        // Need to return something before records are populated so the page doesn't crash
        returnObject = Object.entries(state.reportStatus).map(
          ([stateCode]) => ({
            state: statesArray.find(({ value }) => value === stateCode)?.label,
            stateCode,
          })
        );
      }

      return returnObject;
    },
  };
})();

export const selectYears = (currentYear) => {
  const yearArray = [];
  for (
    let x = 2020;
    x <= Number(currentYear);
    x++ // 2020 is the first year the new CARTS was used so there won't be an < 2020 forms
  ) {
    yearArray.push({ label: `${x}`, value: x });
  }
  return yearArray;
};
