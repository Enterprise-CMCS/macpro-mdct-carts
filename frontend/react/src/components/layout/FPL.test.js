import React from "react";
import { shallow } from "enzyme";
import { storeFactory, findByTestAttribute } from "../../testUtils";

import FPL from "../layout/FPL";

/**
 * Factory functon to create a ShallowWrapper for the Footer component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {any} state - Initial state for setup
 * @returns {ShallowWrapper}
 */
const setup = (props = {}, state = null) => {
  return shallow(<FPL {...props} />);
};

describe("FPL Component, static render checks ", () => {
  const component = setup();
  const instance = component.instance();

  it("renders", () => {
    expect(component.exists()).toBe(true);
  });
  it("renders with test attributes", () => {
    const fplComponent = findByTestAttribute(component, "component-FPL");
    expect(fplComponent.length).toBe(1);
  });

  it("has the appropriate classnames", () => {
    const fplClassname = component.find(".fpl");
    expect(fplClassname.length).toBe(1);
  });

  it("updates local state on text input", () => {
    component.setState({ fpl_per_starts_at: 17 });
    const status = component.state().fpl_per_starts_at;
    expect(status).toEqual(17);
  });
});

describe("FPL Component, state changes and component updates", () => {
  const component = setup();
  beforeEach(() => {
    const instance = component.instance();
  });

  it("correctly calculates FPL percentage", () => {
    let event1 = {
      target: {
        value: "12",
        name: "fpl_per_starts_at",
      },
    };

    let event2 = {
      target: {
        value: 41,
        name: "fpl_per_ends_at",
      },
    };

    let startInput = component.find("[name='fpl_per_starts_at']");

    startInput.simulate("change", {
      target: { value: "16" },
    });

    // console.log(startInput.debug());
    // console.log("fpl start???", foundInput.debug());
    // let trigger1 = instance.calculateFPL(event1);
    // let trigger2 = instance.calculateFPL(event2);
    console.log("NEW STATE??", component.state().fpl_per_starts_at);

    // const status = component.state().fpl_per_starts_at;
    expect(component.state().fpl_per_starts_at).toEqual(16);
  });
  // it("correctly calculates FPL fee", () => {
  //   component.setState({ fpl_per_starts_at: 17, fpl_per_ends_at: 20 });
  //   const status = component.state().fpl_per_starts_at;
  //   expect(status).toEqual("17");
  // });
});
