import React from "react";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import Repeatables from "./Repeatables";

const mockCreateNewRepeatable = jest.fn();
const mockRemoveRepeatable = jest.fn();

jest.mock("../../actions/repeatables", () => ({
  createNewRepeatable: mockCreateNewRepeatable,
  removeRepeatable: mockRemoveRepeatable,
}));

const mockStore = configureMockStore();
const store = mockStore({ lastYearTotals: { 2022: [] } });
const renderQuestion = async (question) =>
  await render(
    <Provider store={store}>
      <Repeatables
        question={question}
        type={null}
        disabled={false}
        addRepeatableTo={mockCreateNewRepeatable}
        removeRepeatableFrom={mockRemoveRepeatable}
      />
    </Provider>
  );

describe("<Repeatables />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("should render with default verbiage", async () => {
    const question = {
      typeLabel: "TypeLabel",
      questions: [],
    };
    await renderQuestion(question);
    screen.getByText("Do you have another TypeLabel in this list?");
    screen.getByText("Optional");
    screen.getByText("Add another TypeLabel");
  });

  test("should hide the Optional hint when specified", async () => {
    const question = {
      hideOptionalHint: true,
      questions: [],
    };
    await renderQuestion(question);
    expect(screen.queryByText("Optional")).toBeNull();
  });

  test("should use override verbiage when specified", async () => {
    const question = {
      addAnotherText: "Y'all got more or what?",
      questions: [],
    };
    await renderQuestion(question);
    expect(screen.queryByText(/Do you have another/)).toBeNull();
    screen.getByText("Y'all got more or what?");
  });

  test("remove button executes remove repeatable function", async () => {
    const question = {
      questions: [{ id: 1 }, { id: 2 }],
    };
    await renderQuestion(question);
    const removeButton = screen.getByRole("button", {
      name: "Delete last item",
    });
    await userEvent.click(removeButton);
    expect(mockRemoveRepeatable).toHaveBeenCalledTimes(1);
  });

  test("add button executes add repeatable function", async () => {
    const question = {
      questions: [],
    };
    await renderQuestion(question);
    const addButton = screen.getByRole("button", {
      name: "Add another",
    });
    await userEvent.click(addButton);
    expect(mockCreateNewRepeatable).toHaveBeenCalledTimes(1);
  });
});
