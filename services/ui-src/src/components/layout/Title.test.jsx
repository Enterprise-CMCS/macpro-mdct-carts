import React from "react";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import { screen, render } from "@testing-library/react";
import Title from "./Title";

const mockStore = configureMockStore();
const store = mockStore({
  global: {
    formYear: 2011,
    stateName: "KY",
  },
  stateUser: {
    name: "Kentucky",
  },
});
const title = (
  <Provider store={store}>
    <Title />
  </Provider>
);

describe("Title Component", () => {
  it("Title should contain Year & State abbr when loaded in state", () => {
    render(title);

    expect(
      screen.getByText("Kentucky CARTS FY2011 Report")
    ).toBeInTheDocument();
  });
});
