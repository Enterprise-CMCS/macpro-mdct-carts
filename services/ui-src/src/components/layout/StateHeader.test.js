import React from "react";
import { shallow } from "enzyme";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import StateHeader from "./StateHeader";

const mockStore = configureMockStore();
const store = mockStore({
  stateUser: {
    name: "Kentucky",
    imageURI: "kentucky.png",
  },
});
const header = (
  <Provider store={store}>
    <StateHeader />
  </Provider>
);

describe("State Header Component", () => {
  it("should render correctly", () => {
    expect(shallow(header).exists()).toBe(true);
  });

  it("Displays name, image, and alt-text for a state", () => {
    const { getByTestId, getByAltText } = render(header);
    const headerComponent = getByTestId("state-header");
    expect(headerComponent).toHaveTextContent("Kentucky");
    const img = getByAltText("Kentucky");
    expect(img.src).toContain("kentucky.png");
  });
});
