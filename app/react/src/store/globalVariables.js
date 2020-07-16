// Storing global variables that will be the same regardless of users

//ACTION TYPES
// This store wont change so we dont need action types

const initialState = {
  formName: "CARTS FY",
  formYear: new Date().getFullYear().toString(),
  largeTextBoxHeight: 6,
};

//ACTION CREATORS
// This store wont change so we dont need action creators

// THUNK CREATORS
// This store wont change so we dont need Thunks

// REDUCER
export default function (state = initialState) {
  return state;
}
