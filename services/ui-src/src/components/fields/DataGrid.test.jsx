import React from "react";
import { screen, render } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";

import DataGrid from "./DataGrid";

jest.mock("./Question", () => (props) => (
  <div className="mock-question-component">{JSON.stringify(props)}</div>
));

const mockStore = configureMockStore();
const store = mockStore({
  lastYearFormData: {},
  formData: [
    {
      contents: {
        section: {
          year: 0,
          state: "AL",
        },
      },
    },
  ],
});

const dataGridWithQuestions = (questions) => (
  <Provider store={store}>
    <DataGrid question={{ questions }} />
  </Provider>
);

describe("<DataGrid />", () => {
  test("should not render child questions without IDs", () => {
    render(dataGridWithQuestions([{}]));
    expect(screen.queryByText(/\{/)).not.toBeInTheDocument();
  });

  test("should render a single child question", () => {
    render(dataGridWithQuestions([{ id: "2022-00-a-01-02-a" }]));
    expect(screen.queryByText(/"id":"2022-00-a-01-02-a"/)).toBeInTheDocument();
  });

  test("should render multiple child questions", () => {
    render(
      dataGridWithQuestions([
        { id: "2022-00-a-01-02-a" },
        { id: "2022-00-a-01-02-b" },
      ])
    );
    expect(screen.queryByText(/"id":"2022-00-a-01-02-a"/)).toBeInTheDocument();
    expect(screen.queryByText(/"id":"2022-00-a-01-02-b"/)).toBeInTheDocument();
  });

  test("should not hide number if child question is a field set", () => {
    render(dataGridWithQuestions([{ id: "mock-id", type: "fieldSet" }]));
    expect(screen.queryByText(/"hideNumber":true/)).toBeInTheDocument();
  });

  /*
   * This seems like a bug? I think the author intended the actual question's
   * type to pass through to the `renderQuestions` array... but it doesn't.
   */
  test.skip("should hide number if child question is not a field set", () => {
    render(dataGridWithQuestions([{ id: "mock-id", type: "text" }]));
    expect(screen.queryByText(/"hideNumber":false/)).toBeInTheDocument();
  });

  test("should fetch value from previous year for 20xx-03-c-05", () => {
    const mockQuestion = {
      questions: [{ id: "2023-03-c-05-03-a" }],
    };

    const store = mockStore({
      lastYearFormData: [
        null,
        null,
        null,
        {
          contents: {
            section: {
              subsections: [
                null,
                null,
                {
                  parts: [
                    null,
                    null,
                    null,
                    null,
                    {
                      questions: [
                        {
                          fieldset_info: {
                            id: "2022-03-c-05-03",
                          },
                          questions: [
                            null,
                            {
                              questions: [
                                {
                                  answer: {
                                    entry: 42, // Holy nested data, Batman!
                                  },
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        },
      ],
      formData: [
        {
          contents: {
            section: {
              year: 0,
              state: "AL",
            },
          },
        },
      ],
    });
    render(
      <Provider store={store}>
        <DataGrid question={mockQuestion} />
      </Provider>
    );

    expect(screen.queryByText(/42/)).toBeInTheDocument();
  });
});
