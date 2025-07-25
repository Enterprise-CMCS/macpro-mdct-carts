import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { Objectives } from "./Objectives";
import { mockInitialState } from "../../util/testing/testUtils";
import userEvent from "@testing-library/user-event";

const mockStore = configureMockStore();
const store = mockStore(mockInitialState);

const mockCreateNewObjective = jest.fn();
const mockRemoveRepeatable = jest.fn();

jest.mock("../../actions/repeatables", () => ({
  createNewObjective: mockCreateNewObjective,
  removeRepeatable: mockRemoveRepeatable,
}));

jest.mock("./Objective", () => {
  return {
    Objective: () => <div data-testid="objective" />,
  };
});

const mockProps = {
  addObjectiveTo: mockCreateNewObjective,
  removeObjectiveFrom: mockRemoveRepeatable,
  disabled: false,
  question: {
    id: "parent question",
    questions: [
      {
        id: 1,
      },
      {
        id: 2,
      },
    ],
  },
  printView: false,
};

const ObjectivesComponent = (
  <Provider store={store}>
    <Objectives {...mockProps} />
  </Provider>
);

describe("Objectives component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("renders", () => {
    render(ObjectivesComponent);
    expect(screen.queryAllByTestId("objective").length).toEqual(
      mockProps.question.questions.length
    );
    expect(
      screen.getByText("Do you have another objective in your State Plan?")
    ).toBeInTheDocument();
  });

  test("remove button executes remove objective function", async () => {
    render(ObjectivesComponent);
    const removeButton = screen.getByRole("button", {
      name: "Delete last objective",
    });
    await userEvent.click(removeButton);
    expect(mockRemoveRepeatable).toHaveBeenCalledTimes(1);
  });

  test("add button executes add objective function", async () => {
    render(ObjectivesComponent);
    const addButton = screen.getByRole("button", {
      name: "Add another objective",
    });
    await userEvent.click(addButton);
    expect(mockCreateNewObjective).toHaveBeenCalledTimes(1);
  });
});
