import React from "react";
import { screen, render } from "@testing-library/react";
import { MemoryRouter } from "../../util/testing/mockRouter";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { Print, getPdfFriendlyDocument } from "./Print";
import { mockInitialState } from "../../util/testing/testUtils";
import { apiLib } from "../../util/apiLib";

const mockLoadSections = jest.fn(() => ({ type: "LOAD_SECTIONS" }));

jest.mock("../layout/Section", () => () => {
  const MockName = "default-section";
  return <MockName data-testid="print-section" />;
});
jest.mock("../../actions/initial", () => ({
  loadSections: (...args) =>
    mockLoadSections(...(args.length ? args : [{ type: "none" }])),
  loadEnrollmentCounts: () => ({ type: "none" }),
}));

// Mock apiLib.post for getPdfFriendlyDocument
jest.mock("../../util/apiLib", () => ({
  apiLib: {
    post: jest.fn(() => Promise.resolve({ data: "mockPdfBase64" })),
  },
}));

const mockStore = configureMockStore([thunk]);
const formState = {
  formData: [
    {
      pk: "AL-2020",
      sectionId: 0,
      year: 2020,
      contents: {
        section: {
          subsections: [{ type: "subsection", parts: [], id: "2020-00-a" }],
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
          subsections: [{ type: "subsection", parts: [], id: "2020-01-a" }],
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
          subsections: [{ type: "subsection", parts: [], id: "2020-02-a" }],
        },
      },
      stateId: "AL",
    },
    {
      pk: "AL-2020",
      sectionId: 3,
      year: 2020,
      contents: {
        section: {
          subsections: [
            { type: "subsection", parts: [], id: "2020-03-a" },
            { type: "subsection", parts: [], id: "2020-03-b" },
          ],
        },
      },
      stateId: "AL",
    },
  ],
};
const store = mockStore({ ...mockInitialState, ...formState });
const setup = (path) => (
  <Provider store={store}>
    <MemoryRouter initialEntries={[path]}>
      <Print />
    </MemoryRouter>
  </Provider>
);

describe("<Print />", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should render for full form", () => {
    const path = "/print?year=2020&state=AL";
    render(setup(path));
    const sections = screen.getAllByTestId("print-section");
    expect(sections.length).toBe(5);
  });

  test("should render for a subsection when provided the subsection query param", () => {
    const path =
      "print?year=2020&state=AL&sectionId=2020-03&subsectionId=2020-03-b";
    render(setup(path));
    const sections = screen.getAllByTestId("print-section");
    expect(sections.length).toBe(1);
  });

  test("does not render sections if formData is empty", () => {
    const emptyStore = mockStore({ ...mockInitialState, formData: [] });
    const EmptySetup = (path) => (
      <Provider store={emptyStore}>
        <MemoryRouter initialEntries={[path]}>
          <Print />
        </MemoryRouter>
      </Provider>
    );
    render(EmptySetup("/print?year=2020&state=AL"));
    expect(screen.queryByTestId("print-section")).toBeNull();
  });

  test("tries to grab and use the statecode from the url if not passed", () => {
    const noStateCode = mockStore({
      ...mockInitialState,
      stateUser: {
        ...mockInitialState.stateUser,
        currentUser: {
          ...mockInitialState.stateUser.currentUser,
          state: { id: undefined, name: undefined },
        },
      },
    });

    Object.defineProperty(window, "location", {
      writable: true,
      value: { search: "/print?id=1&year=2020&state=AL" },
    });

    const noStateCodeSetup = (path) => (
      <Provider store={noStateCode}>
        <MemoryRouter initialEntries={[path]}>
          <Print />
        </MemoryRouter>
      </Provider>
    );
    render(noStateCodeSetup("/print?year=2020&state=AL"));

    expect(mockLoadSections).toHaveBeenCalledWith({
      stateCode: "AL",
      selectedYear: "2020",
    });
  });
});

describe("getPdfFriendlyDocument", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <html>
        <head></head>
        <body>
          <input type="text" />
          <input type="date" />
          <button title="Print"></button>
          <button title="Other"></button>
        </body>
      </html>
    `;
    window.open = jest.fn();
    window.URL.createObjectURL = jest.fn(() => "https://mockFileURL.com");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("calls apiLib.post and opens PDF", async () => {
    // Import Print to access getPdfFriendlyDocument
    await getPdfFriendlyDocument();
    expect(apiLib.post).toHaveBeenCalledWith(
      "/print_pdf",
      expect.objectContaining({
        body: expect.objectContaining({
          encodedHtml: expect.any(String),
        }),
      })
    );
    expect(window.open).toHaveBeenCalledWith("https://mockFileURL.com");
  });
});
