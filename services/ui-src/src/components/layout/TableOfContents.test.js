import React from "react";
import { Provider } from "react-redux";
import TableOfContents from "./TableOfContents";
import { shallow } from "enzyme";
import configureMockStore from "redux-mock-store";
import {
  adminUserWithReportInProgress,
  stateUserWithReportInProgress,
} from "../../store/fakeStoreExamples";
import { screen, render } from "@testing-library/react";
import { MemoryRouter } from "react-router";

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
              type: "subsection",
              parts: [],
              id: "2020-02-a",
              title: "my title",
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
    <MemoryRouter>
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
    <MemoryRouter>
      <TableOfContents />
    </MemoryRouter>
  </Provider>
);

describe("State Header Component", () => {
  it("should render correctly", () => {
    expect(shallow(tableOfContents).exists()).toBe(true);
  });

  it("should render cmsgov vertical nav and pass sections and certify and submit", async () => {
    render(tableOfContents);
    const toc = screen.getByTestId("toc");
    expect(toc.outerHTML).toMatch(/Section 1/);
    expect(toc.outerHTML).toMatch(/Section 2/);
    expect(toc.outerHTML).toMatch(/Certify and Submit/);
  });

  it("should not include certify and submit when a non state user views the ToC", async () => {
    render(adminToc);
    const toc = screen.getByTestId("toc");
    expect(toc.outerHTML).toMatch(/Section 1/);
    expect(toc.outerHTML).toMatch(/Section 2/);
    expect(toc.outerHTML).not.toMatch(/Certify and Submit/);
  });
});
