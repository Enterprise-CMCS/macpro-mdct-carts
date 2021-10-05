// ACTION TYPES
const STATE_INFO = "STATE_INFO";
const USER_INFO = "USER_INFO";
const PROGRAM_INFO = "PROGRAM_INFO";

// ACTION CREATORS
export const getUserData = (userObject) => {
  return {
    type: USER_INFO,
    userObject,
  };
};

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
  programType: "combo", // values can be combo, medicaid_exp_chip, or separate_chip
  programName: "NY Combo Program",
  imageURI: `${process.env.PUBLIC_URL}/img/states/ny.svg`,
  formName: "CARTS FY",
  currentUser: {
    role: false,
    state: { id: "", name: "" },
    username: "",
  },
};

// STATE USER REDUCER
export default (state = initialState, action) => {
  switch (action.type) {
    case STATE_INFO:
      return {
        ...state,
        name: action.name,
        abbr: action.abbr,
        imageURI: action.abbr
          ? `/img/states/${action.abbr.toLowerCase()}.svg`
          : null,
      };
    case USER_INFO:
      return {
        ...state,
        currentUser: action.userObject,
      };
    case PROGRAM_INFO:
      return {
        ...state,
        programType: action.programType,
        programName: action.programName,
        formName: action.formName,
      };
    default:
      return state;
  }
};
