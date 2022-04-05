import React from "react";
import { shallow } from "enzyme";
import {
  storeFactory,
  findByTestAttribute,
  mockInitialState,
} from "../../../testUtils";

import Header from "../Header";

/**
 * Factory functon to create a ShallowWrapper for the Header component.
 * @function setup
 * @param {object} initialState - Component props specific to this setup.
 * @returns {ShallowWrapper}
 */

const setup = (initialState = {}) => {
  const store = storeFactory(initialState);
  return shallow(<Header store={store} />)
    .dive()
    .dive();
};

describe("Header Component, enzyme testing", () => {
  const wrapper = setup(mockInitialState);

  it("renders with test attributes", () => {
    const headerComponent = findByTestAttribute(wrapper, "component-header");
    expect(headerComponent.length).toBe(1);
  });

  it("renders with header classname", () => {
    const headerClassname = wrapper.find(".header");
    expect(headerClassname.length).toBe(1);
  });

  it("includes contact email address provided by redux", () => {
    const usernameDisplay = findByTestAttribute(
      wrapper,
      "component-header-username"
    );
    expect(usernameDisplay.text()).toBe("karen.dalton@state.gov");
  });
});
