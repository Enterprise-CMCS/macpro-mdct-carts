// Storing global variables that will be the same regardless of users
// TODO Question do we want to make formYear updatable.
const initialState = {
  formName: "CARTS FY",
  formYear: "2020",
  largeTextBoxHeight: 6,
  isFetching: false,
};

// Global REDUCER
export default function global(state = initialState, action) {
  // Triggers isFetching which activates Spinner.js (reactRouter.js)
  if (action.type === "CONTENT_FETCHING_STARTED") {
    return { ...state, isFetching: true };
  }

  // Triggers isFetching which deactivates Spinner.js (reactRouter.js)
  if (action.type === "CONTENT_FETCHING_FINISHED") {
    return { ...state, isFetching: false };
  }

  return state;
}
