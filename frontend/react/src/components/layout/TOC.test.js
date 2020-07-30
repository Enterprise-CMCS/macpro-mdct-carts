import React from "react";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
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

  it("has appropriate classnames", () => {
    const tocClassname = wrapper.find(".toc");
    expect(tocClassname.length).toBe(1);
  });
});
