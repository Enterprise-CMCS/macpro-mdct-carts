import React from "react";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import { shallow, mount, ShallowWrapper } from "enzyme";
import {
  storeFactory,
  findByTestAttribute,
  mockInitialState,
  checkProps,
} from "../../testUtils";

import DateRange from "./DateRange";

/**
 * Factory functon to create a ShallowWrapper for the Header component.
 * @function setup
 * @param {object} initialState - Component props specific to this setup.
 * @returns {ShallowWrapper}
 */

const defaultProps = { previousEntry: false };

const setup = (initialState = {}, props = {}) => {
  const setupProps = { ...defaultProps, ...props };
  const store = storeFactory(initialState);
  return shallow(<DateRange store={store} props={setupProps} />)
    .dive()
    .dive();
};

describe("DateRange Component (shallow)", () => {
  const wrapper = setup(mockInitialState, { previousEntry: false });
  it("renders with test attributes", () => {
    const dateComponent = findByTestAttribute(wrapper, "component-date-range");
    expect(dateComponent.length).toBe(1);
  });
  it("has the appropriate classname", () => {
    const dateClassname = wrapper.find(".date-range");
    expect(dateClassname.length).toBe(1);
  });

  it("does not throw warning with expected props", () => {
    const expectedProps = { previousEntry: false };
    console.log(
      "what is actually happening??",
      checkProps(DateRange, expectedProps)
    );
  });

  it("throws a warning when given the wrong props", () => {
    const expectedProps = { previousEntry: "incorrect props" };
    checkProps(DateRange, expectedProps);
  });
});

describe("DateRange Component rendered with previous entries", () => {
  const wrapper = setup(mockInitialState, { previousEntry: true });
  it("displays previous entries when loaded with previousEntry prop", () => {
    const previousEntryDisplay = findByTestAttribute(
      wrapper,
      "component-daterange-monthstart"
    );
    // console.log("value???", previousEntryDisplay.debug());
    expect(previousEntryDisplay.dive().text()).toBe("");
  });
});
