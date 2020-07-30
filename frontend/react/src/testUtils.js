import React, { Component } from "react";
import { shallow } from "enzyme";
import { createStore } from "redux";

import checkPropTypes from "check-prop-types";

import { reducer } from "./store/storeIndex";

export const findByTestAttribute = (wrapper, val) => {
  return wrapper.find(`[data-test="${val}"]`);
};

export const storeFactory = (initialState) => {
  return createStore(reducer, initialState);
};

export const checkProps = (component, conformingProps) => {
  const propError = checkPropTypes(
    component.propTypes,
    conformingProps,
    "prop",
    component.name
  );
  expect(propError).toBeUndefined();
};

export const mockInitialState = {
  stateUser: {
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
  },
  global: {
    formName: "CARTS FY",
    formYear: new Date().getFullYear().toString(),
    largeTextBoxHeight: 6,
  },
};
