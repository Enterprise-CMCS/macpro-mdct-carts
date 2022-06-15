import React from "react";
import { shallow } from "enzyme";
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
  it("should render correctly", () => {
    expect(shallow(title).exists()).toBe(true);
  });

  it("Title should contain Year & State abbr when loaded in state", () => {
    render(title);

    expect(
      screen.getByText("Kentucky CARTS FY2011 Report")
    ).toBeInTheDocument();
  });
});
