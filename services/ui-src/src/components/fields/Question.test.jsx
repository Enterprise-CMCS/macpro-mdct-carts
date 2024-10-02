import React from "react";
import { Provider } from "react-redux";
import { screen, render } from "@testing-library/react";
import configureMockStore from "redux-mock-store";
import Question from "./Question";

const mockStore = configureMockStore();
const store = mockStore({
  formData: [
    {
      contents: {
        section: {
          year: 2023,
          state: "AL",
        },
      },
    },
  ],
  stateUser: {
    abbr: "CMS",
    currentUser: {
      role: "test role",
    },
  },
  global: {
    formYear: 2023,
  },
  reportStatus: {
    status: "in_progress",
    AL2023: {
      status: "in_progress",
      username: "my_user@name.com",
      lastChanged: new Date(),
    },
  },
  enrollmentCounts: {
    chipEnrollments: {},
  },
});

const defaultProps = {
  tableTitle: "Managed Care Costs",
  question: {
    questions: [],
    fieldset_info: {
      rows: [
        [
          {
            contents: "Eligible children",
          },
          {
            actions: ["identity"],
            targets: ["$..*[?(@ && @.id=='2023-05-a-03-01-a')].answer.entry"],
          },
          {
            actions: ["identity"],
            targets: ["$..*[?(@ && @.id=='2023-05-a-03-01-b')].answer.entry"],
          },
        ],
      ],
      headers: [
        {
          contents: "",
        },
        {
          contents: "FFY 2023",
        },
        {
          contents: "FFY 2024",
        },
      ],
    },
    fieldset_type: "synthesized_table",
    type: "fieldset",
  },
};

const QuestionComponentWithProps = () => {
  return (
    <Provider store={store}>
      <Question {...defaultProps} />
    </Provider>
  );
};

describe("Question component", () => {
  test("render question", () => {
    render(QuestionComponentWithProps());
    expect(screen.getByText("Eligible children")).toBeVisible();
  });
});
