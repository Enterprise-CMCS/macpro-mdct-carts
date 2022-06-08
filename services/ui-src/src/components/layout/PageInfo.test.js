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
    lastSave: "01/01/2002",
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
