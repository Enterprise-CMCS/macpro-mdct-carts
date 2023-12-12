import React, { useState } from "react";
import { Provider } from "react-redux";
import { screen, render } from "@testing-library/react";
import userEventLib from "@testing-library/user-event";
import configureMockStore from "redux-mock-store";
import { Range } from "./Ranges";

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

/*
 * <Range> expects to be contained within a component that receives value
 * updates via an onChange handler, and sends them back via the values prop.
 * So we create this harness component to test <Range> in isolation.
 */
const RangeComponentWithProps = (testSpecificProps) => {
  const defaultMockProps = {
    id: "mock-id",
    category: ["start label", "end label"],
    index: 42,
    row: 12,
    type: "mock-type",
    values: ["1,234", "5,678"],
  };

  const props = {
    ...defaultMockProps,
    ...testSpecificProps,
  };

  const [vals, setVals] = useState(props.values);
  const changeHandler = (_row, _cat, index, value) => {
    const newVals = [...vals];
    newVals[index] = value;
    setVals(newVals);
  };

  return (
    <Provider store={store}>
      <Range {...props} onChange={changeHandler} values={vals} />
    </Provider>
  );
};

describe("Range component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render two child inputs with appropriate properties", () => {
    render(<RangeComponentWithProps />);

    const startInput = screen.getByLabelText("start label");
    expect(startInput).toHaveAttribute("id", "mock-id-12-42-0");
    expect(startInput).toHaveValue("1,234");

    const endInput = screen.getByLabelText("end label");
    expect(endInput).toHaveAttribute("id", "mock-id-12-42-1");
    expect(endInput).toHaveValue("5,678");

    expect(
      screen.queryByText("Start value must be less than end value")
    ).not.toBeInTheDocument();
  });

  test("Should render Text inputs by default", () => {
    render(<RangeComponentWithProps type="some unaccounted-for type" />);
    const startInput = screen.getByLabelText("start label");
    expect(startInput).not.toHaveAttribute("inputmode", "numeric");
  });

  test("Should render Text inputs when specified", () => {
    render(<RangeComponentWithProps type="text" />);
    const startInput = screen.getByLabelText("start label");
    expect(startInput).not.toHaveAttribute("inputmode", "numeric");
  });

  test("Should render Percentage inputs", () => {
    render(<RangeComponentWithProps type="percentage" />);
    const startInput = screen.getByLabelText("start label");
    expect(startInput).toHaveAttribute("inputmode", "numeric");
    expect(screen.queryAllByText("$")).toHaveLength(0);
  });

  test("Should render Money inputs", () => {
    render(<RangeComponentWithProps type="money" />);
    const startInput = screen.getByLabelText("start label");
    expect(startInput).toHaveAttribute("inputmode", "numeric");
    expect(screen.getAllByText("$")).toHaveLength(2);
  });

  test("Should disable inputs when specified", () => {
    render(<RangeComponentWithProps disabled />);

    const startInput = screen.getByLabelText("start label");
    expect(startInput).toBeDisabled();

    const endInput = screen.getByLabelText("end label");
    expect(endInput).toBeDisabled();
  });

  test("Should display an error when start is greater than end", async () => {
    render(<RangeComponentWithProps type="percentage" values={["", ""]} />);

    const startInput = screen.getByLabelText("start label");
    await userEvent.type(startInput, "5,678");

    const endInput = screen.getByLabelText("end label");
    await userEvent.type(endInput, "1,234");
    endInput.dispatchEvent(new Event("blur"));

    expect(
      screen.getByText("Start value must be less than end value")
    ).toBeInTheDocument();
  });

  test("Should not validate values for text ranges", async () => {
    render(<RangeComponentWithProps type="text" values={["", ""]} />);

    const startInput = screen.getByLabelText("start label");
    await userEvent.type(startInput, "5,678");

    const endInput = screen.getByLabelText("end label");
    await userEvent.type(endInput, "1,234");
    endInput.dispatchEvent(new Event("blur"));

    expect(
      screen.queryByText("Start value must be less than end value")
    ).not.toBeInTheDocument();
  });
});
