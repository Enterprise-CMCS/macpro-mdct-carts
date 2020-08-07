//ACTION TYPES
const STATE_INFO = "STATE_INFO";
const USER_INFO = "USER_INFO";
const PROGRAM_INFO = "PROGRAM_INFO";

//ACTION CREATORS
export const getUserData = (userObject) => ({
  type: USER_INFO,
  userObject: userObject,
});

export const getProgramData = (programObject) => ({
  type: PROGRAM_INFO,
  programType: programObject.programType,
  programName: programObject.programName,
  formName: programObject.formName,
});

export const getStateData = (stateObject) => ({
  type: STATE_INFO,
  name: stateObject.name,
  abbr: stateObject.abbr,
  imageURI: stateObject.imageURI,
});

const initialState = {
  name: "New York",
  abbr: "NY",
  programType: "comboCHIP", //values can be comboCHIP, mCHIP or sCHIP
  programName: "NY Combo Program",
  imageURI: `${process.env.PUBLIC_URL + "/img/states/ny.svg"}`,
  formName: "CARTS FY",
  currentUser: {
    role: "admin",
    state: { id: "NY", name: "New York" },
    username: "karen.dalton@state.gov",
  },
};

// STATE USER REDUCER
export default function (state = initialState, action) {
  switch (action.type) {
    case STATE_INFO:
      return {
        ...state,
        name: action.name,
        abbr: action.abbr,
        imageURI: action.imageURI,
      };
    case USER_INFO:
      return {
        ...state,
        currentUser: action.userObject,
      };
    case PROGRAM_INFO:
      return {
        ...state,
        programType: action.programObject,
        programName: action.programName,
        formName: action.formName,
      };
    default:
      return state;
  }
}
