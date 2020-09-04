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

  // filter the array of questions and
  // return an array of only the questions that should display
  console.log("BEFORE");
  let data = unfilteredData.filter(filterDisplay(state));
  console.log("A  F T E R");
  return data;
};

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

// This function is explicitly used by filter
// MUST return a boolean for each element of the unfilteredData array
export const filterDisplay = (state) => {
  return function (question) {
    console.log("is question even showing up??", question);
    if (question.questions) {
      // if the current question has subquestions, filter them
      question = question.questions.filter(filterDisplay(state));
      return true;
      // What we're actually trying to do here is say
      // if there are subquestions-- yes, return it (true)
      // but also figure out which subquestions should display
      // which entails editing THE question the topmost filter is iterating on
      // I do not believe this is something the filter function can do
    }
    if (question.context_data) {
      return shouldDisplay(state, question.context_data);
    } else {
      return true;
    }
  };
};

//PSEUODO-CODE & SCRATCH

//question.questions? map through question & filterdisplay(state, subquestion)
// some helper function that will map through the data
// check to see if it should display (use filter???)

/// HELPER FUNCTION
//map through the data.forEach
//call shouldDisplay (state, item.context_data)
// IF FALSE : dont return item, dont recurse
// IF TRUE: do return item

// if item.questions (RECURSIVE)
//

// shouldDisplay()

//TODO: Extract shouldDisplay from CMSChoice

//STICKING POINTS: will this break manually passed down data?
