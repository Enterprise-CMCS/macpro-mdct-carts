import React from "react";
import { shallow } from "enzyme";
import { createStore } from "redux";

import store from "../../store/storeIndex";

// This is where test utility functions go
// add setup, add store factory , add findByTestAttribute
// and any other test helper functions

export const storeFactory = (initialState) => {
  return createStore(store, initialState);
};
