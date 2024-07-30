import { LOAD_LASTYEAR_SECTIONS } from "../actions/initial";
import jsonpath from "../util/jsonpath";
import idLetterMarkers from "../util/idLetterMarkers";

const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_LASTYEAR_SECTIONS:
      return action.data;
    default:
      return state;
  }
};

/* Helper functions for getting values from the JSON returned by the API */
export const selectSectionByOrdinal = (state, ordinal) => {
  const section = state.formData.filter(
    (c) => c.contents.section.ordinal === ordinal
  );
  if (section.length > 0) {
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
  if (subsectionMarker) {
    return [year, sectionChunk, subsectionMarker].join("-");
  }
  return [year, sectionChunk].join("-");
};

export const extractJsonPathExpressionFromQuestionLike = (
  questionLikeId,
  parentId,
  index
) => {
  if (questionLikeId) {
    return `$..*[?(@ && @.id=='${questionLikeId}')]`;
  }
  return `$..*[?(@ && @.id=='${parentId}')].questions[${index}]`;
};

export const selectFragmentByJsonPath = (
  state,
  expr,
  sectionOrdinal = false
) => {
  const sectionNumber = sectionOrdinal || extractSectionOrdinalFromJPExpr(expr);

  const section = selectSectionByOrdinal(state, sectionNumber);
  // Note that the following assumes that there's only one matching result.
  const fragment = jsonpath.query(section, expr)[0];
  return fragment;
};

export const selectFragmentById = (state, id) => {
  const sectionOrdinal = extractSectionOrdinalFromId(id);
  const jpexpr = `$..*[?(@ && @.id=='${id}')]`;
  return selectFragmentByJsonPath(state, jpexpr, sectionOrdinal);
};

/**
 * Selects a fragment from a given object using the jsonpath expression passed in.
 * Assumes there's only one matching result and returns it.
 * @param {Object} target - the data structure to be searched.
 * @param {strign} expr - the JSONPath expression to be used to search.
 */
export const selectFragmentFromTarget = (target, expr) => {
  const results = jsonpath.query(target, expr);
  return results.length ? results[0] : null;
};

/**
 * Selects a fragment from state if given an id or a JSONPath expression.  Does
 * this more efficiently than selectFragmentById or selectFragmentByJsonPath,
 * by using knowledge of how this particular JSON is structured to take a lot
 * of shortcuts.
 * If id isn't supplied, jp must contain an id lookup in it, as this function
 * depends on being able to use knowledge of how ids correspond to the data
 * structure.
 * @param {Object} state - the overall state object. If this doesn't have the formData property, or it's an empty array, returns null.
 * @param {string} id - The id of what we're looking for, e.g. 2020-01-a-01-01-a-01.
 * @param {string} jp - JSONPath expression, although if id is not supplied it must be a JSONPath expression with an id lookup in it.
 */
export const selectFragment = (state, id = null, jp = null) => {
  if (!state.formData || state.formData.length === 0) {
    return null;
  }
  if (!id && !jp) {
    return null;
  }
  const idValue = id ?? jp.split("id=='")[1].split("'")[0];
  const sectionOrdinal = extractSectionOrdinalFromId(idValue);
  const section = selectSectionByOrdinal(state, sectionOrdinal);
  let targetObject = section;
  const chunks = idValue.split("-").slice(2); // Year is irrelevant so we skip it; same for section since we just got it above.
  if (chunks.length >= 2) {
    // id of e.g. (2020-01-)a-01 means our target is the fragment's parent, subsection a:
    targetObject = targetObject.subsections[idLetterMarkers.indexOf(chunks[0])];
  } else {
    // if it's just one chunk, it's a subsection, so:
    return targetObject.subsections[idLetterMarkers.indexOf(chunks[0])];
  }
  if (chunks.length >= 3) {
    // id of e.g. (2020-01-)a-01-01 means our target is the fragment's parent, part 01:
    targetObject = targetObject.parts[Number(chunks[1]) - 1];
  } else {
    // if it's just two chunks it's a part, so:
    return targetObject.parts[Number(chunks[1]) - 1];
  }
  if (chunks.length >= 4) {
    // id of e.g. (2020-01-)a-01-01-a means our target is the fragment's parent, question 01 (although it could also be an objective, etc.):
    targetObject = targetObject.questions[Number(chunks[2]) - 1];
  } else {
    // if it's just three chunks it's a question, so:
    return targetObject.questions[Number(chunks[2]) - 1];
  }
  if (chunks.length >= 5 && idLetterMarkers.includes(chunks[3])) {
    // id of e.g. (2020-01-)a-01-01-a-01 means our target is the fragment's parent, question a:
    targetObject = targetObject.questions[idLetterMarkers.indexOf(chunks[3])];
  }
  // TODO: account for objectives/repeatables here.

  const path = jp || `$..*[?(@ && @.id=='${idValue}')]`;
  return selectFragmentFromTarget(targetObject, path);
};
