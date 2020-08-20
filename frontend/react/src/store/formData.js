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
