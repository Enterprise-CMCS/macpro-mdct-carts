import React from "react";
import { screen, render } from "@testing-library/react";
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

describe("DateRange Component", () => {
  test("renders daterange component", () => {
    render(dateRangeComponent);
    expect(screen.getByText("Start Date")).toBeInTheDocument();
    expect(screen.getByText("End Date")).toBeInTheDocument();
  });
});
