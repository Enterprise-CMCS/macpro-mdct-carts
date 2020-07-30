import React from "react";
import { shallow, mount } from "enzyme";
import { storeFactory, findByTestAttribute } from "../../testUtils";

import TOC from "./TOC";

/**
 * Factory functon to create a ShallowWrapper for the Footer component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {any} state - Initial state for setup
 * @returns {ShallowWrapper}
 */
const setup = (props = {}, state = null) => {
  return shallow(<TOC {...props} />);
};

describe("TOC Component", () => {
  const wrapper = setup();

  it("renders", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("renders with test attributes", () => {
    const tocComponent = findByTestAttribute(wrapper, "component-TOC");
    expect(tocComponent.length).toBe(1);
  });

  it("has appropriate classnames", () => {
    const tocClassname = wrapper.find(".toc");
    expect(tocClassname.length).toBe(1);
  });
  it("has an array of nav items to display", () => {
    const tocArr = findByTestAttribute(wrapper, "component-TOC-arr");
    expect(tocArr.items.length()).toBe(8);
  });
});
