import React from "react";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import { shallow, mount, ShallowWrapper } from "enzyme";
import { storeFactory, findByTestAttribute } from "../../testUtils";

import configureMockStore from "redux-mock-store";

import FPL from "../layout/FPL";

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

    // expect(component.exists(".fpl")).toBe(true);
  });

  it("updates local state on text input", () => {
    component.setState({ fpl_per_starts_at: "17" });
    const status = component.state().fpl_per_starts_at;
    expect(status).toEqual("17");
  });

  // it("correctly calculates FPL", ()=>{
  //   let syntheticEvent
  //   component.calculateFPL()
  // })
});

// (TO DELETE) What else should i test for??
//Test that textfield updates the state
