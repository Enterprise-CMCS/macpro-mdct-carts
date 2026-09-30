import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import Percentage from "./Percentage";

const mockQuestion = {
  answer: { entry: "" },
  id: "percentage",
  label: "Percentage",
};

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
  lastYearFormData: {},
});

describe("Percentage", () => {
  test("adds a wrapper", () => {
    render(
      <Provider store={store}>
        <Percentage question={mockQuestion} />
      </Provider>
    );
    const input = screen.getByRole("textbox", { name: "Percentage" });
    expect(input.parentElement).toHaveClass("input-holder__percent");
  });

  test("doesn't add a second wrapper", () => {
    const { container } = render(
      <React.StrictMode>
        <Provider store={store}>
          <Percentage question={mockQuestion} />
        </Provider>
      </React.StrictMode>
    );
    expect(container.querySelectorAll(".input-holder__percent")).toHaveLength(
      1
    );
  });
});
