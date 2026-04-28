import React from "react";
import { MemoryRouter } from "../../util/testing/mockRouter";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { act, screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormActions from "./FormActions";
import {
  adminUserWithReportInProgress,
  stateUserWithReportInProgress,
} from "../../store/fakeStoreExamples";

const firstLocation = "/sections/2021/00";
const adminFirstLocation = "/views/sections/AL/2021/00";

const mockStore = configureMockStore();
const store = mockStore(stateUserWithReportInProgress);
const formActions = (
  <Provider store={store}>
    <MemoryRouter initialEntries={[firstLocation]}>
      <FormActions />
    </MemoryRouter>
  </Provider>
);
const adminStore = mockStore(adminUserWithReportInProgress);
const adminFormActions = (
  <Provider store={adminStore}>
    <MemoryRouter initialEntries={[adminFirstLocation]}>
      <FormActions />
    </MemoryRouter>
  </Provider>
);

describe("<FormActions />", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should add hrefs given a section and subsection", async () => {
    render(formActions);
    window.history.pushState({}, "Title", "/sections/00");
    const printShowButton = screen.getByTestId("print-show");
    await userEvent.click(printShowButton);
    const printFormButton = screen.getByTestId("print-form");
    const printPageButton = screen.getByTestId("print-page");
    expect(printPageButton).toHaveAttribute(
      "href",
      "/print?year=2021&state=AL&sectionId=2021-00&subsectionId=2021-00-a"
    );
    expect(printFormButton).toHaveAttribute(
      "href",
      "/print?year=2021&state=AL"
    );
  });

  test("should add hrefs given a section and subsection for admin user", async () => {
    const setLocation = (path = "/") => {
      delete window.location;
      window.location = new URL("https://www.example.com" + path);
    };

    setLocation(adminFirstLocation);
    render(adminFormActions);
    window.history.pushState({}, "Title", "/00/a");
    const printShowButton = screen.getByTestId("print-show");
    await userEvent.click(printShowButton);
    const printFormButton = screen.getByTestId("print-form");
    const printPageButton = screen.getByTestId("print-page");
    expect(printPageButton).toHaveAttribute(
      "href",
      "/print?year=2021&state=AL&sectionId=2021-00&subsectionId=2021-00-a"
    );
    expect(printFormButton).toHaveAttribute(
      "href",
      "/print?year=2021&state=AL"
    );
  });

  test("should drop invalid route segments from the print url", async () => {
    const unsafeAdminFormActions = (
      <Provider store={adminStore}>
        <MemoryRouter initialEntries={["/views/sections/AL/2021/0%26/a"]}>
          <FormActions />
        </MemoryRouter>
      </Provider>
    );

    render(unsafeAdminFormActions);
    const printShowButton = screen.getByTestId("print-show");
    await userEvent.click(printShowButton);
    const printFormButton = screen.getByTestId("print-form");
    const printPageButton = screen.getByTestId("print-page");
    expect(printPageButton).toHaveAttribute(
      "href",
      "/print?year=2021&state=AL"
    );
    expect(printFormButton).toHaveAttribute(
      "href",
      "/print?year=2021&state=AL"
    );
  });

  test("should build the component when looking at section 3 subsections", async () => {
    render(
      <Provider store={adminStore}>
        <MemoryRouter initialEntries={["/views/sections/AL/2021/03/a"]}>
          <FormActions />
        </MemoryRouter>
      </Provider>
    );
    const printShowButton = screen.getByTestId("print-show");
    await userEvent.click(printShowButton);
    const printFormButton = screen.getByTestId("print-form");
    const printPageButton = screen.getByTestId("print-page");
    expect(printPageButton).toHaveAttribute(
      "href",
      "/print?year=2021&state=AL&sectionId=2021-03&subsectionId=2021-03-a"
    );
    expect(printFormButton).toHaveAttribute(
      "href",
      "/print?year=2021&state=AL"
    );
  });

  test("should display print section or page on click", async () => {
    render(formActions);
    const printShowButton = screen.getByTestId("print-show");
    await userEvent.click(printShowButton);
    const printFormButton = screen.getByTestId("print-form");
    const printPageButton = screen.getByTestId("print-page");
    expect(printPageButton).toHaveTextContent("This Section");
    expect(printFormButton).toHaveTextContent("Entire Form");
  });

  test("should clear on click", async () => {
    render(formActions);
    const printShowButton = screen.getByTestId("print-show");
    await userEvent.click(printShowButton);
    const printHideButton = screen.getByTestId("print-hide");
    await userEvent.click(printHideButton);

    const printFormButton = screen.queryByTestId("print-form");
    const printPageButton = screen.queryByTestId("print-page");
    expect(printPageButton).toBeNull();
    expect(printFormButton).toBeNull();
  });

  test("should not clear on internal click, then clear on outside click", async () => {
    const map = {};

    document.addEventListener = jest.fn((event, cb) => {
      map[event] = cb;
    });

    render(formActions);
    const printShowButton = screen.getByTestId("print-show");

    await userEvent.click(printShowButton);
    // Check clear
    act(() => {
      map.mousedown({
        target: document.body,
      });
    });
    const printFormButton = screen.queryByTestId("print-form");
    const printPageButton = screen.queryByTestId("print-page");
    expect(printPageButton).toBeNull();
    expect(printFormButton).toBeNull();
  });
});
