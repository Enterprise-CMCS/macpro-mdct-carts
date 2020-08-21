import { LOAD_SECTIONS } from "../actions/initial";

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
