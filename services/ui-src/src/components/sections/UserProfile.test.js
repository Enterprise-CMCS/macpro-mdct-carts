import React from "react";
import { shallow } from "enzyme";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import UserProfile from "./UserProfile";

const mockStore = configureMockStore();
const store = mockStore({});

const userProfile = (
  <Provider store={store}>
    <UserProfile />
  </Provider>
);

describe("UserProfile", () => {
  it("should render the UserProfile Component correctly", () => {
    expect(shallow(userProfile).exists()).toBe(true);
  });
});
