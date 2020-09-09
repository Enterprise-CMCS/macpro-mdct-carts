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
  let unfilteredData = jsonpath.query(state, jp);
  // let data = [];

  // console.log("topmost data", unfilteredData);

  const filteredQuestions = unfilteredData.filter(function (question) {
    return filterDisplay(question, state);
  });

  // unfilteredData.forEach(function (element) {
  //   let filteredQuestion = filterDisplay(element, state); // the result of filterDisplay
  //   // console.log("Lets see the filteredQuestion", filteredQuestion);
  //   if (filteredQuestion) {
  //     // if the result is truthy, not 'false'
  //     data.push(filteredQuestion); // add it to the array of questions
  //   }
  // });

  return filteredQuestions;
  // return data;
};

// This function takes in a single question to be investigated for context data & children
// Returns the question  (if it should display) or'false' for questions that should not
const filterDisplay = (question, state) => {
  // if (!question.context_data) {
  //   // if the question does not contain context_data
  if (!shouldDisplay(state, question.context_data)) {
    // if shouldDisplay returns a false
    return false;
  }
  // }

  if (question.questions) {
    // if the current question has subquestions, filter them recursively

    question.questions = question.questions.filter(function (question) {
      return filterDisplay(question, state);
    });

    // question.questions.forEach(function (questionElement, index) {
    //   let filteredSubQuestion = filterDisplay(questionElement, state);
    //   if (!filteredSubQuestion) {
    //     // return false;
    //     console.log("Are we EVER getting here??????"); // the answer is no!
    //     question.questions.splice(index, 1);
    //   }
    // });
  }
  return true;
  // return question;
};

//TODO: Tuesday,
// Can you edit an element while using filter??
// if you cant edit it, then something else must be done when (question.questions)

// filter ONLY takes functions that return booleans!! you cannot edit an element
// that you are iterating over in a filter callback function

// Greg mentioned using foreach, consider where that can be used. maybe that will makeup for the filter method's shortcomings
// do we add another new function thats like mimickFilter and if (true), populate array with item (item that can be edited)
