import React from "react";
import Footer from "../Footer";

import { findByTestAttribute } from "../../../testUtils";

import { shallow } from "enzyme";

/**
 * Factory functon to create a ShallowWrapper for the Footer component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {any} state - Initial state for setup
 * @returns {ShallowWrapper}
 */
const setup = (props = {}, state = null) => {
  return shallow(<Footer {...props} />);
};

describe("Footer Component (shallow)", () => {
  const wrapper = setup();

  it("renders with appropriate data attribute", () => {
    const footerComponent = findByTestAttribute(wrapper, "component-footer");
    expect(footerComponent.length).toBe(1);
  });
  it("renders with the appropriate footer classname", () => {
    const footerClassname = wrapper.find(".footer");
    expect(footerClassname.length).toBe(1);
  });

  it("includes contact email address attribute", () => {
    const attributeEmail = findByTestAttribute(wrapper, "attribute-email");
    expect(attributeEmail.length).toBe(1);
  });

  it("includes contact email address", () => {
    const email = wrapper.find({ href: "mailto:cartshelp@cms.hhs.gov" });
    expect(email.length).toBe(1);
  });

  it("includes federal website disclaimer", () => {
    expect(wrapper.find(".cms-copy").text()).toBe(
      "A federal government website managed and paid for by the U.S. Centers for Medicare and Medicaid Services and part of the MACPro suite."
    );
  });
});
