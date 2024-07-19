import React from "react";
import { shallow } from "enzyme";
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
  it("should render the UserInfo Component correctly", () => {
    expect(shallow(UserInfoComponent).exists()).toBe(true);
  });
});
