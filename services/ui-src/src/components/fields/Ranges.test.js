import React from "react";
import { Provider } from "react-redux";
import { screen, render } from "@testing-library/react";
import userEventLib from "@testing-library/user-event";
import configureMockStore from "redux-mock-store";
import { Ranges } from "./Ranges";

const userEvent = userEventLib.setup();

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
  lastYearFormData: [],
  lastYearTotals: {},
});

const defaultProps = {
  question: {
    id: "mock-question-id",
    answer: {
      header: "Mock Question Header",
      entry_max: 2,
      entry_min: 1,
      range_type: ["money"],
      range_categories: [["Mock Range Start", "Mock Range End"]],
    },
  },
  onChange: jest.fn(),
};

const RangesComponentWithProps = (testSpecificProps) => {
  return (
    <Provider store={store}>
      <Ranges {...defaultProps} {...testSpecificProps} />
    </Provider>
  );
};

describe("Range component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render header and labels", () => {
    render(RangesComponentWithProps());

    expect(screen.getByText("Mock Question Header")).toBeInTheDocument();
    expect(screen.getByLabelText("Mock Range Start")).toBeInTheDocument();
    expect(screen.getByLabelText("Mock Range End")).toBeInTheDocument();
  });

  test("should render existing values if provided", () => {
    render(
      RangesComponentWithProps({
        ...defaultProps,
        question: {
          ...defaultProps.question,
          answer: {
            ...defaultProps.question.answer,
            entry: [[["123", "456"]]],
          },
        },
      })
    );

    expect(screen.getByLabelText("Mock Range Start")).toHaveValue("123");
    expect(screen.getByLabelText("Mock Range End")).toHaveValue("456");
  });

  test("should allow a ranges to be added and removed", async () => {
    render(RangesComponentWithProps());

    expect(screen.getAllByLabelText("Mock Range Start")).toHaveLength(1);
    expect(screen.queryByText("Remove Last Entry")).not.toBeInTheDocument();

    const addButton = screen.getByText("Add another?");
    await userEvent.click(addButton);

    expect(screen.getAllByLabelText("Mock Range Start")).toHaveLength(2);
    expect(screen.queryByText("Add another?")).not.toBeInTheDocument();

    const removeButton = screen.getByText("Remove Last Entry");
    await userEvent.click(removeButton);

    expect(screen.getAllByLabelText("Mock Range Start")).toHaveLength(1);
  });

  test("Should disable inputs when specified", () => {
    render(
      RangesComponentWithProps({
        ...defaultProps,
        disabled: true,
        question: {
          ...defaultProps.question,
          answer: {
            ...defaultProps.question.answer,
            // Specifying entry, min, and max such that both buttons are visible
            entry: [[["1", "2"]], [["3", "4"]]],
            entry_min: 1,
            entry_max: 3,
          },
        },
      })
    );

    const anInput = screen.getAllByLabelText("Mock Range Start")[0];
    expect(anInput).toBeDisabled();

    const addButton = screen.getByText("Add another?");
    expect(addButton).toBeDisabled();

    const removeButton = screen.getByText("Remove Last Entry");
    expect(removeButton).toBeDisabled();
  });

  test("Should emit appropriate onChange events", async () => {
    render(RangesComponentWithProps());

    const rangeEndInput = screen.getByLabelText("Mock Range End");
    await userEvent.type(rangeEndInput, "5");

    expect(defaultProps.onChange).toBeCalled();
    const evt = defaultProps.onChange.mock.calls[0][0];
    expect(evt).toEqual({
      target: {
        name: "mock-question-id",
        value: [[[null, "5"]]],
      },
    });
  });
});
