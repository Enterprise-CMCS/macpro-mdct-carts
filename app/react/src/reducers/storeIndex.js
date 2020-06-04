//ACTION TYPES
const STATE_INFO = "STATE_INFO";

//ACTION CREATORS
export const stateDetails = (name, imageURI) => {
  return {
    type: STATE_INFO,
    name,
    imageURI,
  };
};

const initialState = {
  name: "New York",
  imageURI: `${process.env.PUBLIC_URL + "/img/states/ny.svg"}`,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case STATE_INFO:
      return { ...state, ...action.name, ...action.imageURI };
    default:
      return state;
  }
};
export default reducer;
