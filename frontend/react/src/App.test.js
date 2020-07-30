import React from "react";
import {
  storeFactory,
  findByTestAttribute,
  mockInitialState,
  checkProps,
} from "./testUtils";
import { shallow } from "enzyme";

import App from "./App";

/**
 * Factory functon to create a ShallowWrapper for the Footer component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {any} state - Initial state for setup
 * @returns {ShallowWrapper}
 */
const setup = (props = {}, state = null) => {
  return shallow(<App {...props} />);
};

describe("renders necessary components (shallow)", () => {
  let wrapper = setup();
  it("renders", () => {
    expect(wrapper.exists()).toBe(true);
  });
  it("renders without error", () => {
    const appComponent = findByTestAttribute(wrapper, "component-app");
    expect(appComponent.length).toBe(1);
  });
  it("has the appropriate classname", () => {
    const appComponent = wrapper.find(".App");
    expect(appComponent.length).toBe(1);
  });
});

const mountedSetup = (initialState = {}, props = {}) => {
  const store = storeFactory(initialState);
  return shallow(<App store={store} />)
    .dive()
    .dive();
};

describe("renders internal components (mounted)", () => {
  const wrapper = mountedSetup(mockInitialState);

  it("renders header (mounted)", () => {
    const appComponent = wrapper.find("[data-test='component-header']");
    expect(appComponent.length).toBe(1);
  });

  // it("App renders", () => {
  //   expect(wrapper.exists(".App")).toBe(true);
  // });
  // it("header renders", () => {
  //   expect(wrapper.exists(".header")).toBe(true);
  // });
  // it("footer renders", () => {
  //   expect(wrapper.exists(".footer")).toBe(true);
  // });

  // it("sidebar renders", () => {
  //   expect(wrapper.exists(".sidebar")).toBe(true);
  // });
});
