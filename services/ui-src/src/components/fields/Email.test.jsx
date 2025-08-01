import React from "react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import Email from "./Email";
import { render, screen } from "@testing-library/react";
import userEventLib from "@testing-library/user-event";

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
const emailProvider = (props) => {
  return (
    <Provider store={store}>
      <Email {...props} />
    </Provider>
  );
};

const defaultQuestion = {
  answer: { entry: "" },
  id: "email",
  label: "Email Address",
};

const onChange = jest.fn();

describe("Email component", () => {
  const basicEmailProvider = emailProvider({
    question: defaultQuestion,
    onChange,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(basicEmailProvider);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  });

  it("calls onChange with valid email", async () => {
    render(basicEmailProvider);

    const expectedLabelText = defaultQuestion.label;
    const inputElement = screen.getByLabelText(expectedLabelText);
    await userEventLib.type(inputElement, "foo@bar.com");

    expect(inputElement.value).toBe("foo@bar.com");
    expect(onChange).toHaveBeenCalledWith({
      target: { name: "email", value: "foo@bar.com" },
    });
  });

  it("shows error for invalid email", async () => {
    render(basicEmailProvider);

    const expectedLabelText = defaultQuestion.label;
    const inputElement = screen.getByLabelText(expectedLabelText);
    await userEventLib.type(inputElement, "foo");

    expect(
      screen.getByText(/please enter a valid email address/i)
    ).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("clears error when input is cleared", async () => {
    render(basicEmailProvider);

    const expectedLabelText = defaultQuestion.label;
    const inputElement = screen.getByLabelText(expectedLabelText);
    await userEventLib.type(inputElement, "foo");

    expect(
      screen.getByText(/please enter a valid email address/i)
    ).toBeInTheDocument();
    await userEventLib.clear(inputElement);
    expect(
      screen.queryByText(/please enter a valid email address/i)
    ).not.toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith({
      target: { name: "email", value: "" },
    });
  });

  it("renders with initial value", () => {
    render(
      emailProvider({
        question: { ...defaultQuestion, answer: { entry: "init@example.com" } },
        onChange,
      })
    );
    const input = screen.getByLabelText(/email address/i);
    expect(input.value).toBe("init@example.com");
  });
});
