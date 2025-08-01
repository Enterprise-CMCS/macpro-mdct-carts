import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import userEventLib from "@testing-library/user-event";
import PhoneNumber from "./PhoneNumber";

const mockQuestion = {
  answer: { entry: "" },
  id: "phone",
  label: "Phone Number",
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

const phoneNumberProvider = (props) => {
  return (
    <Provider store={store}>
      <PhoneNumber {...props} />
    </Provider>
  );
};

const onChange = jest.fn();

describe("PhoneNumber", () => {
  const basicPhoneNumberProvider = phoneNumberProvider({
    question: mockQuestion,
    onChange,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("renders without crashing", () => {
    render(basicPhoneNumberProvider);
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
  });

  it("shows no error for initial empty input", () => {
    render(basicPhoneNumberProvider);
    expect(
      screen.queryByText(/please limit to 10 digits/i)
    ).not.toBeInTheDocument();
  });

  it("accepts valid phone number input", async () => {
    render(basicPhoneNumberProvider);
    const input = screen.getByLabelText(/phone number/i);
    await userEventLib.type(input, "123-456-7890");
    expect(onChange).toHaveBeenCalled();
    expect(
      screen.queryByText(/please limit to 10 digits/i)
    ).not.toBeInTheDocument();
  });

  it("shows error when more than 10 digits are entered", async () => {
    render(basicPhoneNumberProvider);
    const input = screen.getByLabelText(/phone number/i);
    await userEventLib.type(input, "123-456-78901");
    expect(screen.getByText(/please limit to 10 digits/i)).toBeInTheDocument();
  });

  it("removes error when input is corrected to 10 digits", async () => {
    render(basicPhoneNumberProvider);
    const input = screen.getByLabelText(/phone number/i);
    await userEventLib.type(input, "12345678901");
    expect(screen.getByText(/please limit to 10 digits/i)).toBeInTheDocument();
    await userEventLib.clear(input);
    await userEventLib.type(input, "1234567890");
    expect(
      screen.queryByText(/please limit to 10 digits/i)
    ).not.toBeInTheDocument();
  });

  it("removes error when input is cleared", async () => {
    render(basicPhoneNumberProvider);
    const input = screen.getByLabelText(/phone number/i);
    await userEventLib.type(input, "12345678901");
    expect(screen.getByText(/please limit to 10 digits/i)).toBeInTheDocument();
    await userEventLib.clear(input);
    expect(
      screen.queryByText(/please limit to 10 digits/i)
    ).not.toBeInTheDocument();
  });

  it("initializes with value from question.answer.entry", () => {
    const initialNumber = {
      ...mockQuestion,
      answer: { entry: "5551234567" },
    };
    render(
      phoneNumberProvider({
        question: initialNumber,
        onChange,
      })
    );
    const input = screen.getByLabelText(/phone number/i);
    expect(input.value).toBe("5551234567");
  });
});
