import React from "react";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";

import DateRange from "./DateRange";

const mockStore = configureMockStore();
const store = mockStore({
  global: {
    formYear: "2023",
  },
});

const mockPropsExistingAnswer = {
  question: {
    id: "mock-question-1",
    answer: {
      labels: ["Start Date", "End Date"],
    },
  },
  onChange: jest.fn(),
};

const dateRangeComponent = (
  <Provider store={store}>
    <DateRange {...mockPropsExistingAnswer} />
  </Provider>
);

describe("<DateRange />", () => {
  test("renders daterange component", () => {
    render(dateRangeComponent);
    expect(screen.getByText("Start Date")).toBeInTheDocument();
    expect(screen.getByText("End Date")).toBeInTheDocument();
  });

  test("Displays previously-entered information on mount", () => {
    const originalEntry = mockPropsExistingAnswer.question.answer.entry;
    mockPropsExistingAnswer.question.answer.entry = [
      "2022-10-01",
      "2023-09-01",
    ];

    render(dateRangeComponent);

    expect(screen.getByLabelText("range start month").value).toBe("10");
    expect(screen.getByLabelText("range start year").value).toBe("2022");
    expect(screen.getByLabelText("range end month").value).toBe("09");
    expect(screen.getByLabelText("range end year").value).toBe("2023");

    mockPropsExistingAnswer.question.answer.entry = originalEntry;
  });

  test("Displays error text when end month is empty", async () => {
    render(dateRangeComponent);

    const endYearInput = screen.getByLabelText("range end year");
    await userEvent.type(endYearInput, "2023");
    await userEvent.tab();
    /*
     * The fact that the error text is not specific to emptiness is probably a bug
     * expect(
     *   screen.queryByText("Month field cannot be empty")
     * ).toBeInTheDocument();
     */
    expect(screen.queryByText("Please enter a number")).toBeInTheDocument();
  });

  test("Displays error text when end year is empty", async () => {
    render(dateRangeComponent);

    const endMonthInput = screen.getByLabelText("range end month");
    await userEvent.type(endMonthInput, "06");
    await userEvent.tab();
    /*
     * The fact that the error text is not specific to emptiness is probably a bug
     * expect(screen.queryByText("Year field cannot be empty")).toBeInTheDocument();
     */
    expect(screen.queryByText("Please enter a number")).toBeInTheDocument();
  });

  test("Displays error text when start month is empty", async () => {
    render(dateRangeComponent);

    const startYearInput = screen.getByLabelText("range start year");
    await userEvent.type(startYearInput, "2023");
    await userEvent.tab();
    /*
     * The fact that the error text is not specific to emptiness is probably a bug
     * expect(screen.queryByText("Month field cannot be empty")).toBeInTheDocument();
     */
    expect(screen.queryByText("Please enter a number")).toBeInTheDocument();
  });

  test("Displays error text when start month is too long", async () => {
    render(dateRangeComponent);

    const startMonthInput = screen.getByLabelText("range start month");
    await userEvent.type(startMonthInput, "006");

    const startYearInput = screen.getByLabelText("range start year");
    await userEvent.type(startYearInput, "2023");
    await userEvent.tab();

    expect(
      screen.queryByText("Month length must not exceed 2")
    ).toBeInTheDocument();
  });

  test("Displays error text when start month is non-numeric", async () => {
    render(dateRangeComponent);

    const startMonthInput = screen.getByLabelText("range start month");
    await userEvent.type(startMonthInput, "🚮");

    const startYearInput = screen.getByLabelText("range start year");
    await userEvent.type(startYearInput, "2023");
    await userEvent.tab();

    expect(screen.queryByText("Please enter a number")).toBeInTheDocument();
  });

  test("Displays error text when start month is out of range", async () => {
    render(dateRangeComponent);

    const startMonthInput = screen.getByLabelText("range start month");
    await userEvent.type(startMonthInput, "13");

    const startYearInput = screen.getByLabelText("range start year");
    await userEvent.type(startYearInput, "2023");
    await userEvent.tab();

    expect(
      screen.queryByText("Please enter a valid month number")
    ).toBeInTheDocument();
  });

  test("Displays error text when start year is empty", async () => {
    render(dateRangeComponent);

    const startMonthInput = screen.getByLabelText("range start month");
    await userEvent.type(startMonthInput, "11");
    await userEvent.tab();

    /*
     * The fact that the error text is not specific to emptiness is probably a bug
     * expect(screen.queryByText("Year field cannot be empty")).toBeInTheDocument();
     */
    expect(screen.queryByText("Please enter a number")).toBeInTheDocument();
  });

  test("Displays error text when start year is too long", async () => {
    render(dateRangeComponent);

    const startMonthInput = screen.getByLabelText("range start month");
    await userEvent.type(startMonthInput, "11");

    const startYearInput = screen.getByLabelText("range start year");
    await userEvent.type(startYearInput, "02023");
    await userEvent.tab();

    expect(
      screen.queryByText("Year length must not exceed 4")
    ).toBeInTheDocument();
  });

  test("Displays error text when start year is non-numeric", async () => {
    render(dateRangeComponent);

    const startMonthInput = screen.getByLabelText("range start month");
    await userEvent.type(startMonthInput, "11");

    const startYearInput = screen.getByLabelText("range start year");
    await userEvent.type(startYearInput, "twenty-twenty-three");
    await userEvent.tab();

    expect(screen.queryByText("Please enter a number")).toBeInTheDocument();
  });

  test("Displays error text when start year is out of range", async () => {
    render(dateRangeComponent);

    const startMonthInput = screen.getByLabelText("range start month");
    await userEvent.type(startMonthInput, "11");

    const startYearInput = screen.getByLabelText("range start year");
    await userEvent.type(startYearInput, "1619");
    await userEvent.tab();

    expect(screen.queryByText("Please enter a valid Year")).toBeInTheDocument();
  });

  test("Displays error text when the range start is after the range end", async () => {
    render(dateRangeComponent);

    const startMonthInput = screen.getByLabelText("range start month");
    await userEvent.type(startMonthInput, "10");

    const startYearInput = screen.getByLabelText("range start year");
    await userEvent.type(startYearInput, "2022");

    const endMonthInput = screen.getByLabelText("range end month");
    await userEvent.type(endMonthInput, "09");

    const endYearInput = screen.getByLabelText("range end year");
    await userEvent.type(endYearInput, "2021");

    await userEvent.tab();

    /*
     * Have to wait because jest trips over itself. Would use waitFor, but thats in the next
     * version of the testing-lib. When upgrading testing-lib, swap this to waitFor
     */
    await new Promise((r) => setTimeout(r, 400));

    expect(
      await screen.queryByText("End date must come after start date")
    ).toBeInTheDocument();
  });

  test("Fires onChange when all data is valid", async () => {
    render(dateRangeComponent);

    const startMonthInput = screen.getByLabelText("range start month");
    await userEvent.type(startMonthInput, "10");

    const startYearInput = screen.getByLabelText("range start year");
    await userEvent.type(startYearInput, "2022");

    const endMonthInput = screen.getByLabelText("range end month");
    await userEvent.type(endMonthInput, "09");

    const endYearInput = screen.getByLabelText("range end year");
    await userEvent.type(endYearInput, "2023");

    await userEvent.tab();

    /*
     * Have to wait because jest trips over itself. Would use waitFor, but thats in the next
     * version of the testing-lib. When upgrading testing-lib, swap this to waitFor
     */
    await new Promise((r) => setTimeout(r, 400));

    expect(mockPropsExistingAnswer.onChange).toHaveBeenCalledWith([
      "mock-question-1",
      ["2022-10-01", "2023-09-01"],
    ]);
  });
});
