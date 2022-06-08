import React from "react";
import { shallow } from "enzyme";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import Print from "./Print";

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

const printPage = (
  <Provider store={store}>
    <Print />
  </Provider>
);

describe("Print", () => {
  it("should render the Print Component correctly", () => {
    expect(shallow(printPage).exists()).toBe(true);
  });
});
