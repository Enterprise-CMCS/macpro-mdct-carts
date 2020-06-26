//ACTION TYPES
const STATE_INFO = "STATE_INFO";

//ACTION CREATORS
export const stateDetails = (name, programType, imageURI, formName, formYear) => {
  return {
    type: STATE_INFO,
    name,
    programType,
    imageURI,
    formName,
    formYear,
  };
};

const initialState = {
  name: "New York",
  programType: "Combo",
  imageURI: `${process.env.PUBLIC_URL + "/img/states/ny.svg"}`,
  formName: "CARTS FY",
  formYear: "2020",
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case STATE_INFO:
      return { ...state, ...action.programType, ...action.name, ...action.imageURI, ...action.formName, ...action.formYear };
    default:
      return state;
  }
};
export default reducer;
