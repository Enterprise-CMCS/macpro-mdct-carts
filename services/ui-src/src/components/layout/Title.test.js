import React from "react";
import { shallow } from "enzyme";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import Title from "./Title";

const mockStore = configureMockStore();
const store = mockStore({
  global: {
    formYear: 2011,
    stateName: "KY",
  },
  stateUser: {
    name: "Alphonse",
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
    const { getByTestId } = render(title);
    const title = getByTestId("report-title");
    expect(title).toHaveTextContent("KY");
    expect(title).toHaveTextContent("2011");
  });
});
