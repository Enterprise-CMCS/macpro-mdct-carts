import { createStore, combineReducers, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "@redux-devtools/extension";
import formData from "./formData";
import lastYearFormData from "./lastYearFormData";
import { lastYearTotals } from "./lastYearTotals";
import save from "./save";
import stateUser from "./stateUser";
import global from "./globalVariables";
import saveMiddleware from "./saveMiddleware";
import allStatesData from "./allStatesData";
import fiscalYearTemplate from "./fiscalYearTemplate";
import reportStatus from "./reportStatus";
import enrollmentCounts from "./enrollmentCounts";
import { initAuthManager } from "../hooks/authHooks";
import { MODE } from "../util/constants";
import { logger } from "redux-logger";
// Consolidate reducers
export const reducer = combineReducers({
  formData,
  save,
  stateUser,
  global,
  allStatesData,
  fiscalYearTemplate,
  reportStatus,
  lastYearFormData,
  lastYearTotals,
  enrollmentCounts,
});

// Consolidate middleware
let middlewareArray = [thunkMiddleware, saveMiddleware];
// log redux only in dev environment
if (MODE === "development") {
  middlewareArray = [...middlewareArray, logger];
}
const middleware = composeWithDevTools(applyMiddleware(...middlewareArray));

// Create store with reducers and middleware
const store = createStore(reducer, middleware);

// Create singleton for tracking auth events
initAuthManager(store);

// Export the store to be picked up by the root component in index.js
export default store;
