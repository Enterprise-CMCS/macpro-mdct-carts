import React from "react";
import { shallow } from "enzyme";
import PageInfo from "./PageInfo";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import { screen, render } from "@testing-library/react";

const mockStore = configureMockStore();
const store = mockStore({
  reportStatus: {
    status: null,
  },
  save: {
    lastSave: new Date(
      "Mon Jan 1 2024 12:00:00 GMT-0400 (Eastern Daylight Time)"
    ),
  },
});
jest.mock("./Title", () => () => {
  const MockName = "default-title";
  return <MockName />;
});
const pageInfo = (
  <Provider store={store}>
    <PageInfo />
  </Provider>
);

describe("Page Info Component", () => {
  it("should render correctly", () => {
    expect(shallow(pageInfo).exists()).toBe(true);
  });

  it("if no status exists, Draft should display", () => {
    render(pageInfo);
    const editInfo = screen.getByTestId("edit-info-display");
    expect(editInfo).toHaveTextContent("draft");
  });
});
