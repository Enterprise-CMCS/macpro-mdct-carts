import React from "react";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import { shallow, mount } from "enzyme";

import configureMockStore from "redux-mock-store";

import FPL from "../layout/FPL";

const mockStore = configureMockStore();

describe("FPL Component", () => {
  const component = shallow(<FPL />);

  it("renders", () => {
    expect(component.exists()).toBe(true);
  });

  it("has appropriate classnames", () => {
    expect(component.exists(".fpl")).toBe(true);
  });

  it("updates local state on text input", () => {
    component.setState({ fpl_per_starts_at: "17" });

    const status = component.state().fpl_per_starts_at;

    expect(status).toEqual("17");
  });
});

// (TO DELETE) What else should i test for??
//Test that textfield updates the state
