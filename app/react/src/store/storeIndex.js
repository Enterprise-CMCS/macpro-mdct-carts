import { createStore, combineReducers, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import stateUser from "./stateUser";

// Consolidate reducers
const reducer = combineReducers({ stateUser });

// Consolidate middleware
let middlewareArray = [thunkMiddleware];
// log redux only in dev environment
if (process.env.NODE_ENV === `development`) {
  const { logger } = require(`redux-logger`);

  middlewareArray = [...middlewareArray, logger];
}
const middleware = composeWithDevTools(applyMiddleware(...middlewareArray));

// Create store from reducers and middleware
const store = createStore(reducer, middleware);

export default store;
