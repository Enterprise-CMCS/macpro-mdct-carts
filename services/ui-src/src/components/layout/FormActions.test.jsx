import React from "react";
import { shallow } from "enzyme";
import FormActions from "./FormActions";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { screen, render, fireEvent } from "@testing-library/react";
import {
  adminUserWithReportInProgress,
  stateUserWithReportInProgress,
} from "../../store/fakeStoreExamples";
import { MemoryRouter } from "react-router";

const mockStore = configureMockStore();
const store = mockStore(stateUserWithReportInProgress);
const formActions = (
  <Provider store={store}>
    <MemoryRouter initialEntries={["/"]}>
      <FormActions />
    </MemoryRouter>
  </Provider>
);
const adminStore = mockStore(adminUserWithReportInProgress);
const adminFormActions = (
  <Provider store={adminStore}>
    <MemoryRouter initialEntries={["/"]}>
      <FormActions />
    </MemoryRouter>
  </Provider>
);
describe("Fill Form Component", () => {
  test("should render correctly", () => {
    expect(shallow(formActions).exists()).toBe(true);
  });
  test("should add hrefs given a section and subsection", () => {
    render(formActions);
    const printShowButton = screen.getByTestId("print-show");
    fireEvent.click(printShowButton);
    const printFormButton = screen.getByTestId("print-form");
    const printPageButton = screen.getByTestId("print-page");
    expect(printPageButton).toHaveAttribute("href");
    expect(printFormButton).toHaveAttribute("href");
  });
  test("should build the component when looking at section 3 subsections", () => {
    render(adminFormActions);
    window.history.pushState({}, "Title", "/sections/03");
    const printShowButton = screen.getByTestId("print-show");
    fireEvent.click(printShowButton);
    const printFormButton = screen.getByTestId("print-form");
    const printPageButton = screen.getByTestId("print-page");
    expect(printPageButton).toHaveAttribute("href");
    expect(printFormButton).toHaveAttribute("href");
  });
  test("should display print section or page on click", () => {
    render(formActions);
    const printShowButton = screen.getByTestId("print-show");
    fireEvent.click(printShowButton);
    const printFormButton = screen.getByTestId("print-form");
    const printPageButton = screen.getByTestId("print-page");

    expect(printPageButton).toHaveTextContent("This Section");
    expect(printFormButton).toHaveTextContent("Entire Form");
  });
  test("should clear on click", () => {
    render(formActions);
    const printShowButton = screen.getByTestId("print-show");
    fireEvent.click(printShowButton);
    const printHideButton = screen.getByTestId("print-hide");
    fireEvent.click(printHideButton);

    const printFormButton = screen.queryByTestId("print-form");
    const printPageButton = screen.queryByTestId("print-page");
    expect(printPageButton).toBeNull();
    expect(printFormButton).toBeNull();
  });
  test("should not clear on internal click, then clear on outside click", () => {
    const map = {};

    document.addEventListener = jest.fn((event, cb) => {
      map[event] = cb;
    });

    render(formActions);
    const printShowButton = screen.getByTestId("print-show");
    fireEvent.click(printShowButton);

    // Check clear
    map.mousedown({
      target: document.body,
    });
    const printFormButton = screen.queryByTestId("print-form");
    const printPageButton = screen.queryByTestId("print-page");
    expect(printPageButton).toBeNull();
    expect(printFormButton).toBeNull();
  });
});
