import React from "react";
import { shallow } from "enzyme";
import { createStore } from "redux";

import { store, reducer } from "./store/storeIndex";

export const findByTestAttribute = (wrapper, val) => {
  return wrapper.find(`[data-test="${val}"]`);
};

export const storeFactory = (initialState) => {
  return createStore(reducer, initialState);
};

export const stateUserTestData = {
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
};
