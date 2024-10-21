import React from "react";
import { shallow } from "enzyme";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import { screen, render } from "@testing-library/react";
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
  ],
  enrollmentCounts: {
    chipEnrollments: {},
  },
  global: {
    isFetching: false,
  },
});
const buildPart = (partId, nestedSubsectionTitle = false) => {
  return (
    <Provider store={store}>
      <Part partId={partId} nestedSubsectionTitle={nestedSubsectionTitle} />
    </Provider>
  );
};

describe("Part Component", () => {
  it("should render correctly", () => {
    expect(shallow(buildPart("2020-00")).exists()).toBe(true);
  });

  it("renders text and any questions provided", () => {
    render(buildPart("2020-00-a-01"));
    const part = screen.getByTestId("part");
    expect(part).toHaveTextContent("information about your state");
    const question = screen.getByTestId("part-question");
    expect(question).not.toBeNull();
  });

  it("conditionally renders a title", () => {
    render(buildPart("2020-00-a"));
    const title = screen.getByTestId("part-header");
    expect(title).toHaveTextContent("my title");
  });

  it("subtitles rendered if appropriate as a nested subsection", () => {
    render(buildPart("2020-00-a-01", true));
    const title = screen.getByTestId("part-sub-header");
    expect(title).toHaveTextContent("Welcome!");
  });

  it("When no title is provided, no header is renderd", () => {
    render(buildPart("2020-00-a-02"));
    const title = screen.queryByTestId("part-header");
    screen.conta;
    expect(title).toBeNull;
  });
});
