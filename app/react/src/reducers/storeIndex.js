//ACTION TYPES
const STATE_INFO = "STATE_INFO";

//ACTION CREATORS
export const stateDetails = (
  name,
  abbr,
  programType,
  programName,
  imageURI,
  formName,
  formYear
) => {
  return {
    type: STATE_INFO,
    name,
    abbr,
    programType,
    programName,
    imageURI,
    formName,
    formYear,
  };
};

const initialState = {
  name: "New York",
  abbr: "NY",
  programType: "comboCHIP", //values can be comboCHIP, mCHIP or sCHIP
  programName: "NY Combo Program",
  imageURI: `${process.env.PUBLIC_URL + "/img/states/ny.svg"}`,
  formName: "CARTS FY",
  formYear: "2020",
  largeTextBoxHeight: 6,
  currentUser: {
    role: "admin",
    state: { id: "ny", name: "New York" },
    username: "karen.dalton@state.gov",
  },
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case STATE_INFO:
      return {
        ...state,
        ...action.abbr,
        ...action.programType,
        ...action.programName,
        ...action.name,
        ...action.imageURI,
        ...action.formName,
        ...action.formYear,
        ...action.textBoxHeight,
        ...action.user,
      };
    default:
      return state;
  }
};
export default reducer;
