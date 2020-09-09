import jsonpath from "jsonpath";

import { selectFragment, shouldDisplay } from "./formData";

export const selectSectionTitle = (state, sectionId) => {
  const jspath = `$..formData[*].contents.section[?(@.id=='${sectionId}')].title`;
  const sectionTitles = jsonpath.query(state, jspath);

  if (sectionTitles.length) {
    return sectionTitles[0];
  }
  return null;
};

export const selectSubsectionTitleAndPartIDs = (state, subsectionId) => {
  const subsection = selectFragment(state, subsectionId);

  if (subsection) {
    return {
      parts: subsection.parts.map((part) => part.id),
      title: subsection.title,
    };
  }
  return null;
};

export const selectPartTitle = (state, partId) => {
  const part = selectFragment(state, partId);

  if (part) {
    return {
      text: part.text,
      title: part.title,
    };
  }
  return null;
};

export const selectQuestion = (state, id) => {
  const jp = `$..[*].contents.section.subsections[*].parts[*]..questions[?(@.id=='${id}')]`;
  const questions = jsonpath.query(state, jp);
  if (questions.length) {
    return questions[0];
  }

  return null;
};

// Returns an array of questions for the QuestionComponent to map through
export const selectQuestionsForPart = (state, partId) => {
  const jp = `$..[*].contents.section.subsections[*].parts[?(@.id=='${partId}')].questions[*]`;
  let unfilteredData = JSON.parse(JSON.stringify(jsonpath.query(state, jp)));

  const filteredQuestions = unfilteredData.filter(function (question) {
    return filterDisplay(question, state);
  });

  return filteredQuestions;
};

// This function takes in a single question to be investigated for context data & children
// Returns the question  (if it should display) or'false' for questions that should not
const filterDisplay = (question, state) => {
  if (!shouldDisplay(state, question.context_data)) {
    // if shouldDisplay returns a false
    return false;
  }

  if (question.questions) {
    // if the current question has subquestions, filter them recursively

    question.questions = question.questions.filter(function (question) {
      return filterDisplay(question, state);
    });
  }
  return true;
};
