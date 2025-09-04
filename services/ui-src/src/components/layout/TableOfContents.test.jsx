import React from "react";
import { screen, render, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureMockStore from "redux-mock-store";
import TableOfContents from "./TableOfContents";
import {
  adminUserWithReportInProgress,
  stateUserSimple,
  stateUserWithReportInProgress,
} from "../../store/fakeStoreExamples";

const mockStore = configureMockStore();
const formState = {
  formData: [
    {
      pk: "AL-2020",
      sectionId: 0,
      year: 2020,
      contents: {
        section: {
          id: "2020-00",
          ordinal: 0,
          title: "my section",
          subsections: [
            {
              type: "subsection",
              parts: [],
              id: "2020-00-a",
              title: "my title",
            },
          ],
        },
      },
      stateId: "AL",
    },
    {
      pk: "AL-2020",
      sectionId: 1,
      year: 2020,
      contents: {
        section: {
          id: "2020-01",
          ordinal: 1,
          title: "my section",
          subsections: [
            {
              type: "subsection",
              parts: [],
              id: "2020-01-a",
              title: "my title",
            },
          ],
        },
      },
      stateId: "AL",
    },
    {
      pk: "AL-2020",
      sectionId: 2,
      year: 2020,
      contents: {
        section: {
          id: "2020-02",
          ordinal: 2,
          title: "my section",
          subsections: [
            {
              type: "subsectionA",
              parts: [],
              id: "2020-02-a",
              title: "my title",
            },
            {
              type: "subsectionB",
              parts: [],
              id: "2020-02-b",
              title: "b title",
            },
            {
              type: "subsectionC",
              parts: [],
              id: "2020-02-c",
              title: "c title",
            },
          ],
        },
      },
      stateId: "AL",
    },
  ],
};
const store = mockStore({
  ...stateUserWithReportInProgress,
  ...formState,
});
const tableOfContents = (
  <Provider store={store}>
    <MemoryRouter initialEntries={["/sections/2020/01"]}>
      <TableOfContents />
    </MemoryRouter>
  </Provider>
);

const adminStore = mockStore({
  ...adminUserWithReportInProgress,
  ...formState,
});
const adminToc = (
  <Provider store={adminStore}>
    <MemoryRouter initialEntries={["/views/sections/00"]}>
      <TableOfContents />
    </MemoryRouter>
  </Provider>
);

const noFormsStore = mockStore(stateUserSimple);
const noFormsToC = (
  <Provider store={noFormsStore}>
    <MemoryRouter>
      <TableOfContents />
    </MemoryRouter>
  </Provider>
);

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

const setLocation = (path = "/") => {
  delete window.location;
  window.location = new URL("https://www.example.com" + path);
};

describe("<TableOfContents />", () => {
  beforeEach(() => {
    setLocation();
  });
  test("should render cmsgov vertical nav and pass sections and certify and submit", async () => {
    render(tableOfContents);
    expect(screen.getByText("Section 1: my section")).toBeVisible();
    expect(screen.getByText("Section 2: my section")).toBeVisible();
    expect(screen.getByText("Certify and Submit")).toBeVisible();
  });

  test("should not include certify and submit when a non state user views the ToC", async () => {
    render(adminToc);
    expect(screen.getByText("Section 1: my section")).toBeVisible();
    expect(screen.getByText("Section 2: my section")).toBeVisible();
    expect(screen.queryByText("Certify and Submit")).not.toBeInTheDocument();
  });
  test("should handle an active path with /views/sections", async () => {
    setLocation("/views/sections/");
    render(adminToc);
    expect(screen.getByText("Section 1: my section")).toBeVisible();
    expect(screen.getByText("Section 2: my section")).toBeVisible();
    expect(screen.queryByText("Certify and Submit")).not.toBeInTheDocument();
  });
  test("should not crash without any form data", async () => {
    setLocation("/views/sections/");
    render(noFormsToC);
    expect(screen.queryByText("Section 1: my section")).not.toBeInTheDocument();
    expect(screen.queryByText("Section 2: my section")).not.toBeInTheDocument();
    expect(screen.queryByText("Certify and Submit")).not.toBeInTheDocument();
  });
  test("should navigate on click", async () => {
    render(tableOfContents);
    const aSection = screen.getByText(/Section 1/);
    fireEvent.click(aSection);
    expect(mockedUsedNavigate).toHaveBeenCalledWith("/sections/2020/01");
  });
});
