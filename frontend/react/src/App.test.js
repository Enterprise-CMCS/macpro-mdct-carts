import React from "react";
import { Provider } from "react-redux";
import {
  storeFactory,
  findByTestAttribute,
  mockInitialState,
  checkProps,
} from "./testUtils";
import { shallow, mount } from "enzyme";

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

const mountedSetup = (initialState = {}) => {
  const store = storeFactory(initialState);
  return mount(
    <Provider store={store}>
      <App />
    </Provider>
  );
};

describe("renders internal components, sidebar and header (mounted)", () => {
  const wrapper = mountedSetup(mockInitialState);

  it("renders child components, header", () => {
    expect(wrapper.exists(".header")).toBe(true);
  });
  it("renders child components, footer", () => {
    expect(wrapper.exists(".footer")).toBe(true);
  });
});
