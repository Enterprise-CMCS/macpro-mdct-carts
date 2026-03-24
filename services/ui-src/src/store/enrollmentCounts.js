import { SET_ENROLLMENT_COUNTS } from "../actions/initial";

const initialState = {
  chipEnrollments: [],
};

// oxlint-disable-next-line no-anonymous-default-export
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
