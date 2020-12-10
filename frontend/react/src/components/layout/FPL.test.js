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

  let startInput = component.find("[name='fpl_per_starts_at']");

  startInput.simulate("change", {
    target: {
      value: 16,
      name: "fpl_per_starts_at",
    },
  });

  startInput.simulate("change", {
    target: {
      value: 41,
      name: "fpl_per_ends_at",
    },
  });
  it("updates FPL percentage start on user input", () => {
    expect(component.state().fpl_per_starts_at).toEqual(16);
  });
  it("updates FPL percentage end on user input", () => {
    expect(component.state().fpl_per_ends_at).toEqual(41);
  });

  it("has no error when the FPL error start smaller than the FPL error end", () => {
    expect(component.state().fpl_error_percent).toEqual(false);
  });
});
