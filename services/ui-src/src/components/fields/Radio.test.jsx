import React from "react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { render, screen } from "@testing-library/react";
import userEventLib from "@testing-library/user-event";
import Radio from "./Radio";

const mockQuestion = {
  id: "mockQuestion",
  answer: {
    entry: "option1",
    options: [
      { label: "Option 1", value: "option1" },
      { label: "Option 2", value: "option2" },
    ],
  },
  questions: [
    {
      id: "child1",
      type: "text_multiline",
      label: "childTextQuestion",
      answer: { entry: null },
      context_data: {
        conditional_display: {
          type: "conditional_display",
          hide_if: {
            target: "$..*[?(@ && @.id=='mockQuestion')].answer.entry",
            values: {
              interactive: [null, "option2"],
              noninteractive: ["option2"],
            },
          },
        },
      },
    },
  ],
};

const mockStore = configureMockStore();
const store = mockStore({
  // Mock store state
  stateUser: {
    currentUser: { id: "user1", name: "Test User", role: "STATE_USER" },
  },
  global: {
    formYear: 2023,
    state: "AL",
  },
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
  reportStatus: {
    status: "in_progress",
    year: 2024,
    stateCode: "AL",
  },
});
const radioProvider = (props) => {
  return (
    <Provider store={store}>
      <Radio name="test-radio" {...props} />
    </Provider>
  );
};

const onChange = jest.fn();
const onClick = jest.fn();

const basicRadioProvider = radioProvider({
  question: mockQuestion,
  onChange,
  onClick,
});

describe("Radio Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders radio options", () => {
    render(basicRadioProvider);
    expect(screen.getByLabelText("Option 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Option 2")).toBeInTheDocument();
  });

  it("checks the radio button based on initial value", () => {
    render(basicRadioProvider);
    expect(screen.getByLabelText("Option 1")).toBeChecked();
    expect(screen.getByLabelText("Option 2")).not.toBeChecked();
  });

  it("calls onChange and updates checked value when a radio is selected", async () => {
    render(basicRadioProvider);
    const option2 = screen.getByLabelText("Option 2");
    await userEventLib.click(option2);
    expect(onChange).toHaveBeenCalled();
    expect(option2).toBeChecked();
  });

  it("renders children questions when an option is selected", async () => {
    render(basicRadioProvider);
    const option2 = screen.getByLabelText("Option 2");
    await userEventLib.click(option2);
    expect(onChange).toHaveBeenCalled();
    expect(option2).toBeChecked();
    // Children should be rendered for the checked option
    expect(screen.getByText("childTextQuestion")).toBeInTheDocument();
  });

  it("handles missing children gracefully", () => {
    const questionNoChildren = {
      ...mockQuestion,
      questions: [],
    };
    render(radioProvider({ question: questionNoChildren }));
    expect(screen.queryByText("childTextQuestion")).not.toBeInTheDocument();
  });
});
