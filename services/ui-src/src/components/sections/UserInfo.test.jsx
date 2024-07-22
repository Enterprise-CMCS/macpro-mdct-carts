import React from "react";
import { mount } from "enzyme";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
// components
import UserInfo from "./UserInfo";
// mocks
import { stateUserWithReportInProgress } from "../../store/fakeStoreExamples";

const mockStore = configureMockStore([thunk]);
const stateUser = mockStore(stateUserWithReportInProgress);

const UserInfoComponent = (
  <Provider store={stateUser}>
    <UserInfo />
  </Provider>
);

describe("UserInfo", () => {
  const { email, state } = stateUserWithReportInProgress.stateUser.currentUser;
  it("should render the UserInfo Component correctly", () => {
    const wrapper = mount(UserInfoComponent);
    expect(wrapper.find("li").first().text()).toBe(`username: ${email}`);
    expect(wrapper.find("li").at(1).text().trim()).toBe(`state: ${state.id}`);
  });
});
