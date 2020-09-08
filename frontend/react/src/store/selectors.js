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

export const selectQuestionsForPart = (state, partId) => {
  const jp = `$..[*].contents.section.subsections[*].parts[?(@.id=='${partId}')].questions[*]`;
  let unfilteredData = jsonpath.query(state, jp);
  let data = [];

  // unfilteredData.forEach(filterFunction(element))

  unfilteredData.forEach(function (element) {
    let someVar = filterDisplay(element, state);
    if (someVar) {
      data.push(someVar);
    } else {
      return;
    }
  });

  return data;
};

const filterDisplay = (question, state) => {
  if (question.context_data) {
    if (!shouldDisplay(state, question.context_data)) {
      return false;
    }
  }

  if (question.questions) {
    // if the current question has subquestions, filter them
    question.questions.forEach(function (questionElement, index) {
      let newVar = filterDisplay(questionElement, state);
      if (!newVar) {
        question.questions.splice(index, 1);
      }
    });
  }
  return question;
};

// const filterFunction = (singleQuestion, state) => {
// if (singleQuestion.context_data){
//   shouldDisplay(state, singleQuestion.context_data)
// }

// };

//TODO: Tuesday,
// selectQuestionsForPart is not even happening in section1-api!!!
// because it is reading from manual parts
// inspect the if statement on lines 73-75
// Can you edit an element while using filter??
// if you cant edit it, then something else must be done when (question.questions)

// filter ONLY takes functions that return booleans!! you cannot edit an element
// that you are iterating over in a filter callback function

// Greg mentioned using foreach, consider where we can use that! maybe that will makeup for filter's shortcomings!!!!!!!!!
// do we add another new function thats like mimickFilter and if (true), populate array with item (item that can be edited)

// This function is provided a single question and the application state
// Returns the question (if it should display) or a falsy value if it is to be skipped in selectQuestionsForPart
