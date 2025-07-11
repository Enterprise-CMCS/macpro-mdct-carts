import statesArray from "../components/utils/statesArray";

// Storing global variables that will be the same regardless of users
const earliestYear = 2020;

// eslint-disable-next-line no-extend-native
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

export const updateStateName = (stateInitials) => {
  const stateName = statesArray.find(
    ({ value }) => value === stateInitials
  )?.label;
  return {
    type: "UPDATE_STATE_NAME",
    stateName,
  };
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
  state.queryParams = document.location.search.toString();
  state.currentYear = 2025;

  /**
   * Current Year is being used exclusively to determine what range of ints should be marked as years when
   * trying to pull a year from the url or query params, as state user vs admin user have different pathings.
   *
   * Feels fragile, but the end result is either set that number high or change it yearly until refactored.
   */
  const activeYears = [];
  for (let i = earliestYear; i <= state.currentYear; i++) {
    activeYears.push(i);
  }

  for (let activeYear in activeYears) {
    if (
      state.url.indexOf(activeYears[activeYear]) !== -1 ||
      state.queryParams.indexOf(activeYears[activeYear]) !== -1
    ) {
      state.formYear = parseInt(activeYears[activeYear]);
      break;
    }
  }

  if (typeof state.formYear == "undefined") {
    state.formYear = 2020;
  }

  switch (action.type) {
    case "CONTENT_FETCHING_STARTED":
      return { ...state, isFetching: true };
    case "CONTENT_FETCHING_FINISHED":
      return { ...state, isFetching: false };
    case "UPDATE_FORM_YEAR":
      return { ...state, formYear: action.year, isFetching: false };
    case "UPDATE_STATE_NAME":
      return { ...state, stateName: action.stateName, isFetching: false };
    default:
      return state;
  }
}
