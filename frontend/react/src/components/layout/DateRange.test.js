import React from "react";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import { shallow, ShallowWrapper, render } from "enzyme";
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
  return shallow(<DateRange store={store} {...setupProps} />)
    .dive()
    .dive();
};

const setupTopmostComponent = (initialState = {}, props = {}) => {
  const setupProps = { ...defaultProps, ...props };
  const store = storeFactory(initialState);
  return shallow(<DateRange store={store} {...setupProps} />);
};

describe("DateRange Component (shallow)", () => {
  const wrapper = setup(mockInitialState);
  it("renders with test attributes", () => {
    const dateComponent = findByTestAttribute(wrapper, "component-date-range");
    expect(dateComponent.length).toBe(1);
  });
  it("has the appropriate classname", () => {
    const dateClassname = wrapper.find(".date-range");
    expect(dateClassname.length).toBe(1);
  });
  it("initializes as empty string when props.previousEntry is false", () => {
    const previousEntryDisplay = findByTestAttribute(
      wrapper,
      "component-daterange-monthstart"
    )
      .shallow()
      .props().children[1].props.value;
    expect(previousEntryDisplay).toBe("");
  });
  it("initializes as empty string when props.previousEntry is true", () => {
    const previousEntrywrapper = setup(mockInitialState, {
      previousEntry: true,
    });
    const previousEntryDisplay = findByTestAttribute(
      previousEntrywrapper,
      "component-daterange-monthstart"
    )
      .shallow()
      .props().children[1].props.value;
    expect(previousEntryDisplay).toBe(5);
  });
});

describe("DateRange Component (shallow)", () => {
  it("starts with the initial props", () => {
    const wrapper = setupTopmostComponent(mockInitialState, {
      previousEntry: true,
    });
    let props = wrapper.props().children.props;
    expect(props.previousEntry).toBe(true);
  });
});
