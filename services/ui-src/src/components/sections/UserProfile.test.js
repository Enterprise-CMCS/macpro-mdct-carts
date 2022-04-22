import React from "react";
import { mount, shallow } from "enzyme";
import { axe } from "jest-axe";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import UserProfile from "./UserProfile";

const mockStore = configureMockStore();
const store = mockStore({
  stateUser: {
    currentUser: {
      email: "",
      username: "",
      firstname: "",
      lastname: "",
      role: "",
      state: {
        id: "",
      },
    },
  },
});

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

describe("Test UserProfile accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const wrapper = mount(userProfile);
    const results = await axe(wrapper.html());
    expect(results).toHaveNoViolations();
  });
});
