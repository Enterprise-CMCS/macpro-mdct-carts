//ACTION TYPES
const STATE_INFO = "STATE_INFO";
const USER_INFO = "USER_INFO";

// THUNK CREATOR
export const getUserThunk = (someID) => (dispatch) => {
  try {
    // const { data } = someCallToDatabase
    const data = {
      role: "admin",
      state: { id: "ca", name: "California" },
      username: "james.lufton@state.gov",
    };
    dispatch(getUserData(data));
  } catch (error) {
    console.log(error);
  }
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

//ACTION CREATORS
const getUserData = (userObject) => ({
  type: STATE_INFO,
  userObject: userObject,
});

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

// THUNK CREATORS
//Where we will call the backend and dispatch info to reducer

// REDUCER
export default function (state = initialState, action) {
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
        ...action.largeTextBoxHeight,
        ...action.currentUser,
      };
    case USER_INFO:
      return {
        ...state,
        current: action.userObject,
      };

    default:
      return state;
  }
}
