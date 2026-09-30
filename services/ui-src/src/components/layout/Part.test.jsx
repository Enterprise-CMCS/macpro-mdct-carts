import React from "react";
import { screen, render } from "@testing-library/react";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import Part from "./Part";
import { AppRoles } from "../../types";

jest.mock("../fields/Question", () => () => {
  const MockName = "default-question";
  return <MockName data-testid="part-question" />;
});
const mockStore = configureMockStore();
const store = mockStore({
  allStatesData: [],
  stateUser: {
    currentUser: {
      role: AppRoles.CMS_ADMIN,
    },
  },
  reportStatus: {
    status: "certified",
    AL2020: {
      status: "certified",
      username: "my_user@name.com",
      lastChanged: new Date(),
    },
  },
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
              parts: [
                {
                  id: "2020-00-a-01",
                  text: "We already have some information about your state from our records. If any information is incorrect, please contact the [mdct_help@cms.hhs.gov](mailto:mdct_help@cms.hhs.gov).",
                  type: "part",
                  title: "Welcome!",
                  questions: [
                    {
                      id: "2020-00-a-01-01",
                      type: "text",
                      label: "State or territory name:",
                      answer: {
                        entry: "Alabama",
                        readonly: true,
                        prepopulated: true,
                      },
                    },
                  ],
                },
                {
                  id: "2020-00-a-02",
                  text: "We already have some information about your state from our records. If any information is incorrect, please contact the [mdct_help@cms.hhs.gov](mailto:mdct_help@cms.hhs.gov).",
                  type: "part",
                  questions: [
                    {
                      id: "2020-00-a-02-01",
                      type: "text",
                      label: "State or territory name:",
                      answer: {
                        entry: "Alabama",
                        readonly: true,
                        prepopulated: true,
                      },
                    },
                  ],
                },
                {
                  id: "2020-00-a-03",
                  text: "This question may be skipped.",
                  type: "part",
                  title: "Skipped question",
                  context_data: {
                    skip_text:
                      "This question doesn’t apply to your state since you answered NO to the previous question.",
                    conditional_display: {
                      type: "conditional_display",
                      hide_if: {
                        target:
                          "$..*[?(@ && @.id=='2020-00-a-01-01')].answer.entry",
                        values: {
                          interactive: ["Alabama"],
                          noninteractive: ["Alabama"],
                        },
                      },
                    },
                  },
                  questions: [],
                },
              ],
              id: "2020-00-a",
              title: "my title",
            },
          ],
          context_data: {},
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
          title: "my other section",
          subsections: [
            {
              type: "subsection",
              id: "2020-01-a",
              parts: [
                {
                  id: "2020-01-a-01",
                  type: "part",
                  title: "first part title",
                  questions: [],
                },
                {
                  id: "2020-01-a-02",
                  type: "part",
                  questions: [],
                },
                {
                  id: "2020-01-a-03",
                  type: "part",
                  title: " ",
                  questions: [],
                },
              ],
            },
          ],
          context_data: {},
        },
      },
      stateId: "AL",
    },
  ],
  enrollmentCounts: {
    chipEnrollments: {},
  },
  global: {
    isFetching: false,
  },
});
const buildPart = (partId, partNumber) => {
  return (
    <Provider store={store}>
      <Part partId={partId} partNumber={partNumber} />
    </Provider>
  );
};

describe("<Part />", () => {
  test("renders text and any questions provided", () => {
    render(buildPart("2020-00-a-01"));
    const part = screen.getByTestId("part");
    expect(part).toHaveTextContent("information about your state");
    const question = screen.getByTestId("part-question");
    expect(question).not.toBeNull();
  });

  test("conditionally renders a title", () => {
    render(buildPart("2020-00-a"));
    const title = screen.getByTestId("part-h2-header");
    expect(title).toHaveTextContent("my title");
  });

  test("When no title is provided, no header is rendered", () => {
    render(buildPart("2020-00-a-02"));
    const title = screen.queryByTestId("part-h2-header");
    expect(title).toBeNull();
  });

  test("skipped part alert has the skip-text-alert class so it prints", () => {
    render(buildPart("2020-00-a-03"));
    const alert = screen.getByTestId("part-alert").closest(".ds-c-alert");
    expect(alert).toHaveClass("skip-text-alert");
    expect(alert).toHaveTextContent(
      "This question doesn’t apply to your state since you answered NO to the previous question."
    );
  });

  test("renders a numbered part with a title", () => {
    render(buildPart("2020-01-a-01", 1));
    const title = screen.getByTestId("part-h2-header");
    expect(title).toHaveTextContent("Part 1: first part title");
  });

  test("renders a numbered part with no title", () => {
    render(buildPart("2020-01-a-02", 2));
    const title = screen.getByTestId("part-h2-header");
    expect(title).toHaveTextContent("Part 2");
    expect(title.textContent).not.toContain(":");
  });

  test("renders a numbered part with a whitespace-only title", () => {
    render(buildPart("2020-01-a-03", 3));
    const title = screen.getByTestId("part-h2-header");
    expect(title).toHaveTextContent("Part 3");
    expect(title.textContent).not.toContain(":");
  });

  test("does not render 'Part N' for section 0, even with a partNumber", () => {
    render(buildPart("2020-00-a", 1));
    const title = screen.getByTestId("part-h2-header");
    expect(title).toHaveTextContent("my title");
    expect(title.textContent).not.toContain("Part");
  });
});
