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

  it("renders", () => {
    expect(component.exists()).toBe(true);
  });

  it("has the appropriate classnames", () => {
    const fplClassname = component.find(".fpl");
    expect(fplClassname.length).toBe(1);
  });

  it("updates local state on text input", () => {
    component.setState({ fpl_per_starts_at: "17" });
    const status = component.state().fpl_per_starts_at;
    expect(status).toEqual("17");
  });

  it("correctly calculates FPL", () => {
    // let syntheticEvent
    // component.calculateFPL()
    // Incomplete test
  });
});
