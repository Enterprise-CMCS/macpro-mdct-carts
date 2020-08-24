import { createStore, combineReducers, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import formData from './formData';
import stateUser from "./stateUser";
import global from "./globalVariables";

// Consolidate reducers
export const reducer = combineReducers({ formData, stateUser, global });

// Consolidate middleware
let middlewareArray = [thunkMiddleware];
// log redux only in dev environment
if (process.env.NODE_ENV === `development`) {
  const { logger } = require(`redux-logger`);

  middlewareArray = [...middlewareArray, logger];
}
const middleware = composeWithDevTools(applyMiddleware(...middlewareArray));

// Create store with reducers and middleware
const store = createStore(reducer, middleware);

// Export the store to be picked up by the root component in index.js
export default store;
