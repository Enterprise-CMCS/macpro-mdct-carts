import React from "react";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import { shallow, mount, ShallowWrapper } from "enzyme";
import { storeFactory } from "../../testUtils";

import configureMockStore from "redux-mock-store";

import DateRange from "./DateRange";

/**
 * Factory functon to create a ShallowWrapper for the Header component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {any} state - Initial state for setup
 * @returns {ShallowWrapper}
 */

const mockStore = configureMockStore();

// const setup = (props = {}, state = null) => {
//   return shallow(<DateRange {...props} />);
// };

const setup = (initialState = {}) => {
  const store = storeFactory(initialState);
  const wrapper = shallow(<DateRange store={store} />);
};

const findByTestAttribute = (wrapper, val) => {
  return wrapper.find(`[data-test="${val}"]`);
};

describe("DateRange Component (shallow)", () => {
  const wrapper = setup();

  it("renders without error", () => {
    const dateComponent = wrapper.find("[data-test='component-date-range']");
    expect(dateComponent.length).toBe(1);
  });
  it("has the appropriate classname", () => {
    const dateClassname = wrapper.find(".date-range");
    expect(dateClassname.length).toBe(1);
  });
});
