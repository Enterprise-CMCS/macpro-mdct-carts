import React from "react";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import { shallow, mount, ShallowWrapper } from "enzyme";
import {
  storeFactory,
  findByTestAttribute,
  stateUserTestData,
} from "../../testUtils";
import checkPropTypes from "check-prop-types";

import { reducer } from "../../store/storeIndex";

import configureMockStore from "redux-mock-store";

import DateRange from "./DateRange";

/**
 * Factory functon to create a ShallowWrapper for the Header component.
 * @function setup
 * @param {object} initialState - Component props specific to this setup.
 * @returns {ShallowWrapper}
 */

const setup = (initialState = {}) => {
  const store = storeFactory(initialState);
  return shallow(<DateRange store={store} />)
    .dive()
    .dive();
};

describe("DateRange Component (shallow)", () => {
  const wrapper = setup(stateUserTestData);
  it("renders with test attributes", () => {
    const dateComponent = findByTestAttribute(wrapper, "component-date-range");
    expect(dateComponent.length).toBe(1);
  });
  it("has the appropriate classname", () => {
    const dateClassname = wrapper.find(".date-range");
    expect(dateClassname.length).toBe(1);
  });

  // it ("does not throw warning with expected props", ()=>{
  //   const expectedProps = {success: false}
  //   const propError =
  // })
});
