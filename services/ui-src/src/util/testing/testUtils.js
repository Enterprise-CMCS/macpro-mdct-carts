import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

//import checkPropTypes from "check-prop-types";

import { reducer } from "../../store/storeIndex";

export const findByTestAttribute = (wrapper, val) => {
  return wrapper.find(`[data-test="${val}"]`);
};

export const storeFactory = (initialState) => {
  return createStore(reducer, initialState, applyMiddleware(thunk));
};

/*
 *export const checkProps = (component, conformingProps) => {
 *   const propError = checkPropTypes(
 *    component.propTypes,
 *    conformingProps,
 *    "prop",
 *    component.name
 *
 *  //return expect(propError).toBeUndefined();
 *};
 */

export const mockInitialState = {
  formData: [],
  stateUser: {
    name: "New York",
    abbr: "NY",
    programType: "comboCHIP", //values can be comboCHIP, mCHIP or sCHIP
    programName: "NY Combo Program",
    imageURI: "/img/states/ny.svg",
    formName: "CARTS FY",
    currentUser: {
      role: "admin",
      state: { id: "NY", name: "New York" },
      username: "test@state.gov",
    },
  },
  global: {
    formName: "CARTS FY",
    formYear: new Date().getFullYear(),
    largeTextBoxHeight: 6,
  },
  save: {
    error: false,
    saving: false,
  },
  reportStatus: {
    TEST2024: {
      status: "in_progress",
      year: 2024,
      stateCode: "AL",
      lastChanged: "2024-01-04 18:28:18.524133+00",
      username: "test@test.com",
      programType: "user",
    },
  },
};
