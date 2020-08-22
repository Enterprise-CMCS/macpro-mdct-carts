import { LOAD_SECTIONS } from "../actions/initial";
import jsonpath from "jsonpath";

const initialState = [ ];

export default (data = initialState, action) => {
  switch (action.type) {
    case LOAD_SECTIONS:
      return action.data;
    default:
      return data;
  }
};

export const selectSectionByOrdinal = (state, ordinal) => {
  const section = state.formData.filter(c => c.contents.section.ordinal === ordinal);
  if(section.length > 0) {
    return section[0].contents;
  }
  return null;
}

export const extractSectionOrdinalFromId = (state, id) => {
  const chunks = id.split("-");
  const sectionOrdinal = parseInt(chunks[1], 10);
  return sectionOrdinal;
};

export const selectFragmentByJsonPath = (state, sectionOrdinal, expr) => {
  const section = (selectSectionByOrdinal(state, sectionOrdinal));
  // Note that the following assumes that there's only one matching result.
  const fragment = jsonpath.query(section, expr)[0];
  return fragment;

};

export const selectFragmentById = (state, id) => {
  const sectionOrdinal = extractSectionOrdinalFromId(state, id);
  const jpexpr = `$..*[?(@.id=='${id}')]`;
  return selectFragmentByJsonPath(state, sectionOrdinal, jpexpr);
    /*
    const section = (selectSectionByOrdinal(state, sectionOrdinal));
    console.log(section);
    const fragment = jsonpath.query(section, jpexpr)[0];
    console.log(fragment);
    return fragment;
    */
}


