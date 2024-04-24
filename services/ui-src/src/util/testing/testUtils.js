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

/**
 * Returns a jest function with a response provided through the text field in the body.
 * Convenience function to not worry about the nested resolves.
 * apiLib awaits the call, then the parsing via text()
 * @param {*} expectedResponse The expected item to come back from the api
 * @returns
 */
export const mockAmplifyRequest = (expectedResponse = undefined) =>
  jest.fn(() =>
    Promise.resolve({ body: { text: () => Promise.resolve(expectedResponse) } })
  );

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
    // eslint-disable-next-line no-undef
    imageURI: `${process.env.PUBLIC_URL + "/img/states/ny.svg"}`,
    formName: "CARTS FY",
    currentUser: {
      role: "admin",
      state: { id: "NY", name: "New York" },
      username: "karen.dalton@state.gov",
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
};
