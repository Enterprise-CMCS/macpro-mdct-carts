import { SET_ENROLLMENT_COUNTS } from "../actions/initial";

const initialState = {
  chipEnrollments: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ENROLLMENT_COUNTS:
      return {
        ...state,
        chipEnrollments: action.data,
      };
    default:
      return state;
  }
};
