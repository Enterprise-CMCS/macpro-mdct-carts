import React from "react";
import Footer from "../Footer";

import renderer from "react-test-renderer";
import { shallow, mount } from "enzyme";

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

  it("renders without error", () => {
    const footerComponent = wrapper.find("[data-test='component-footer']");
    expect(footerComponent.length).toBe(1);
  });
  it("has the appropriate classname", () => {
    const footerClassname = wrapper.find(".footer");
    expect(footerClassname.length).toBe(1);
  });

  it("includes contact email address attribute", () => {
    const attributeEmail = wrapper.find("[data-test='attribute-email']");
    expect(attributeEmail.length).toBe(1);
  });

  it("includes contact email address", () => {
    const email = wrapper.find({ href: "mailto:cartshelp@cms.hhs.gov" });
    expect(email.exists()).toBe(true);
  });

  it("includes federal website disclaimer", () => {
    expect(wrapper.find(".cms-copy").text()).toBe(
      "A federal government website managed and paid for by the U.S. Centers for Medicare and Medicaid Services and part of the MACPro suite."
    );
  });
});

describe("Footer Component (mounted & snapshot)", () => {
  const component = mount(<Footer />);

  it("renders", () => {
    expect(component.exists()).toBe(true);
  });

  // describe("Footer Component, snapshot testing", () => {
  //   const snapShot = renderer.create(<Footer />);

  //   it("should match the snapshot", () => {
  //     expect(snapShot.toJSON()).toMatchSnapshot();
  //   });
});
