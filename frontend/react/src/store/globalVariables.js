// Storing global variables that will be the same regardless of users

const initialState = {
  formName: "CARTS FY",
  formYear: new Date().getFullYear().toString(),
  largeTextBoxHeight: 6,
  isFetching: false,
};

// Global REDUCER
export default function global(state = initialState, action) {
  let result;

  switch (action.type) {
    case "CONTENT_FETCHING_STARTED":
      result = { ...state, isFetching: true };
      break;

    case "CONTENT_FETCHING_FINISHED":
      result = { ...state, isFetching: false };
      break;

    case "SIGN_IN_STARTED":
      result = { ...state, isSigningIn: true };
      break;

    case "SIGN_IN_FINISHED":
      result = { ...state, isSigningIn: false };
      break;

    default:
      result = state;
      break;
  }

  return result;
}
