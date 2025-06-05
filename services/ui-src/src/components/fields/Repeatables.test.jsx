import React from "react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { screen, render } from "@testing-library/react";
import Repeatables from "./Repeatables";

const mockStore = configureMockStore();
const store = mockStore({ lastYearTotals: { 2022: [] } });
const renderQuestion = async (question) =>
  await render(
    <Provider store={store}>
      <Repeatables
        question={question}
        type={null}
        disabled={false}
        addRepeatableTo={jest.fn()}
        removeRepeatableFrom={jest.fn()}
      ></Repeatables>
    </Provider>
  );

describe("<Repeatables />", () => {
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
});
