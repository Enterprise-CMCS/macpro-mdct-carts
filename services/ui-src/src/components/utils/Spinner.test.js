import React from "react";
import { render } from "@testing-library/react";
import Spinner from "./Spinner";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";

const setup = (loading) => {
  const mockStore = configureMockStore();
  const store = mockStore({ global: { isFetching: loading } });

  return (
    <Provider store={store}>
      <Spinner />
    </Provider>
  );
};
describe("Spinner component", () => {
  it("should display img when fetching", () => {
    const { getByTestId } = render(setup(true));
    expect(getByTestId("spinner-img")).toBeTruthy();
  });
  it("should not display img when not fetching", () => {
    const { queryByTestId } = render(setup(false));
    expect(queryByTestId("spinner-img")).toBeNull();
  });
});
