// import thunkMiddleware from 'redux-thunk'
import {
  createStore,
  combineReducers,
  applyMiddleware,
  bindActionCreators,
} from "redux";

//ACTION TYPES
const STATE_INFO = "STATE_INFO";

//ACTION CREATORS
const stateDetails = (name, imageURI) => {
  return {
    type: STATE_INFO,
    name,
    imageURI,
  };
};

const initialState = {
  name: "MD",
  imageURI: process.env.PUBLIC_URL + "/img/new-york-temp.png",
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
