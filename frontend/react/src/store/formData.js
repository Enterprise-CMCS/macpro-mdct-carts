import { LOAD_SECTIONS, QUESTION_ANSWERED } from "../actions/initial";
import jsonpath from "jsonpath";
import * as _ from "underscore";

import { selectQuestion } from './selectors'

const initialState = [];

export default (sdata = initialState, action) => {
  switch (action.type) {
    case LOAD_SECTIONS:
      return action.data;
    case QUESTION_ANSWERED:
      const fragment = selectQuestion(
        { formData: sdata },
        action.fragmentId
      );
      fragment.answer.entry = action.data;
      return JSON.parse(JSON.stringify(sdata));
    default:
      return sdata;
  }
};

/* Helper functions for getting values from the JSON returned by the API */
export const selectSectionByOrdinal = (state, ordinal) => {
  const section = state.formData.filter(c => c.contents.section.ordinal === ordinal);
  if(section.length > 0) {
    return section[0].contents.section;
  }
  return null;
};

export const extractSectionOrdinalFromId = (id) => {
  const chunks = id.split("-");
  const sectionOrdinal = parseInt(chunks[1], 10);
  return sectionOrdinal;
};

export const extractSectionOrdinalFromJPExpr = (jpexpr) => {
  const id = jpexpr.split("id=='")[1].split("'")[0];
  return extractSectionOrdinalFromId(id);
};

/**
 * @param {int} year: full four-digit year.
 * @param {int} sectionOrdinal: just the digit; we don't expect it to have a leading zero here.
 * @param {string} subsectionMarker: a–z or aa–zz. Should be lowercase by the time it gets here.
 * @returns {string} e.g. 2020-01-a.
 */
export const constructIdFromYearSectionAndSubsection = (
  year,
  sectionOrdinal,
  subsectionMarker
) => {
  const sectionChunk = sectionOrdinal.toString().padStart(2, "0");
  return [year, sectionChunk, subsectionMarker].join("-");
};

export const extractJsonPathExpressionFromQuestionLike = (
  questionLikeId,
  parentId,
  index
) => {
  if (questionLikeId) {
    return `$..*[?(@.id=='${questionLikeId}')]`;
  } else {
    return `$..*[?(@.id=='${parentId}')].questions[${index}]`;
  }
};

export const selectFragmentByJsonPath = (
  state,
  expr,
  sectionOrdinal = false
) => {
  if (!sectionOrdinal) {
    sectionOrdinal = extractSectionOrdinalFromJPExpr(expr);
  }
  const section = selectSectionByOrdinal(state, sectionOrdinal);
  // Note that the following assumes that there's only one matching result.
  const fragment = jsonpath.query(section, expr)[0];
  return fragment;
};

export const selectFragmentById = (state, id) => {
  const sectionOrdinal = extractSectionOrdinalFromId(id);
  const jpexpr = `$..*[?(@.id=='${id}')]`;
  return selectFragmentByJsonPath(state, jpexpr, sectionOrdinal);
};
/* /Helper functions for getting values from the JSON returned by the API */

/**
 * @param {Object} fragment: the fragment we want to turn into a shallower tree.
 * @returns {Object} The shallower-tree version of the fragment.
 */
export const winnowProperties = (fragment) => {
  if (!fragment) {
    return null;
  }

  // Remove the property named key, then replace it with a list of objects containing only the ids of the original objects in the list.
  const winnow = (orig, key) => {
    let copy = _.omit(orig, [key]);
    copy[key] = orig[key].map( (item) => item.id ? { id: item.id } : {})
    return copy;
  }

  // Check for subsections, parts, and questions, in that order. 
  const props = ["subsections", "parts", "questions"];
  for (let prop of props) {
    if (prop in fragment) {
      return winnow(fragment, prop);
    }
  }

  return fragment;
}

// Generate subsection label including letter, ie: 'Section 3F'
export const generateSubsectionLabel = (str) => {
  let idArray = str.split("-");
  let sectionNumber = Number(idArray[1]);
  return `Section ${sectionNumber}${idArray[2]}`;
};
