// Storing global variables that will be the same regardless of users
const activeYears = ["2020", "2021", "2022", "2023", "2024"];
String.prototype.containsAny =
  String.prototype.containsAny ||
  function (arr) {
    for (var i = 0; i < arr.length; i++) {
      if (this.indexOf(arr[i]) > -1) {
        return true;
      }
    }
    return false;
  };

const initialState = {
  formName: "CARTS FY",
  largeTextBoxHeight: 6,
  isFetching: false,
};

export const updateFormYear = (year) => {
  return {
    type: "UPDATE_FORM_YEAR",
    year,
  };
};

// Global REDUCER
export default function global(state = initialState, action) {
  // Triggers isFetching which activates Spinner.js (reactRouter.js)
  state.url = document.location.pathname.toString();

  for (let activeYear in activeYears) {
    if (state.url.indexOf(activeYears[activeYear]) != -1) {
      state.formYear = activeYears[activeYear];
      break;
    }
  }

  if (state.formYear == undefined) {
    state.formYear = 2020;
  }
  if (action.type === "CONTENT_FETCHING_STARTED") {
    return { ...state, isFetching: true };
  }

  // Triggers isFetching which deactivates Spinner.js (reactRouter.js)
  if (action.type === "CONTENT_FETCHING_FINISHED") {
    return { ...state, isFetching: false };
  } else if (action.type === "UPDATE_FORM_YEAR") {
    return { ...state, formYear: action.year, isFetching: false };
  }
  return state;
}
