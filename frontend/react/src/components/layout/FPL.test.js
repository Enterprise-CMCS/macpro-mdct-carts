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

describe("FPL Component", () => {
  const component = setup();
  const instance = component.instance();

  it("renders", () => {
    expect(component.exists()).toBe(true);
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

    let trigger1 = instance.calculateFPL(event1);
    let trigger2 = instance.calculateFPL(event2);

    const status = component.state().fpl_per_starts_at;
    expect(status).toEqual(12);
  });
  // it("correctly calculates FPL fee", () => {
  //   component.setState({ fpl_per_starts_at: 17, fpl_per_ends_at: 20 });
  //   const status = component.state().fpl_per_starts_at;
  //   expect(status).toEqual("17");
  // });
});
