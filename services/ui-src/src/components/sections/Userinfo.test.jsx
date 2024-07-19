import React from "react";
import { mount, shallow } from "enzyme";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
// components
import Userinfo from "./Userinfo";
// mocks
import { stateUserWithReportInProgress } from "../../store/fakeStoreExamples";
import { axe } from "jest-axe";

const mockStore = configureMockStore([thunk]);
const stateUser = mockStore(stateUserWithReportInProgress);

const UserinfoComponent = (
  <Provider store={stateUser}>
    <Userinfo />
  </Provider>
);

describe("Userinfo", () => {
  it("should render the Userinfo Component correctly", () => {
    expect(shallow(UserinfoComponent).exists()).toBe(true);
  });
});

describe("Test Userinfo accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const wrapper = mount(UserinfoComponent);
    const results = await axe(wrapper.html());
    expect(results).toHaveNoViolations();
  });
});
