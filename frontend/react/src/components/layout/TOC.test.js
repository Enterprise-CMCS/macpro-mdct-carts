import React from "react";
import { shallow, mount } from "enzyme";
import { storeFactory, findByTestAttribute } from "../../testUtils";
import { VerticalNav } from "@cmsgov/design-system-core";

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
  let verticalNavWrapper = wrapper.find(VerticalNav).shallow();
  let itemProps = verticalNavWrapper.props().children;

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
  it("has an array of eight navigation items to display", () => {
    expect(itemProps).toHaveLength(8);
  });

  it("has the navigation URLS for basic-info", () => {
    let urlReference = itemProps[0].props.url;
    expect(urlReference).toBe("/basic-info");
  });

  it("has the navigation URLS for section 1", () => {
    let urlReference = itemProps[1].props.url;
    expect(urlReference).toBe("/section1");
  });
  it("has the navigation URLS for section 2b", () => {
    let urlReference = itemProps[2].props.items[1].url;
    expect(urlReference).toBe("/section2/2b");
  });
});
