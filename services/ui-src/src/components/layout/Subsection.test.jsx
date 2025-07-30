import React from "react";
import { render, screen } from "@testing-library/react";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import { mockInitialState } from "../../util/testing/testUtils";
import Subsection from "./Subsection";

const mockStore = configureMockStore();
const store = mockStore(mockInitialState);

jest.mock("../../store/selectors", () => ({
  selectSubsectionTitleAndPartIDs: jest.fn().mockReturnValue({
    parts: [{}],
  }),
}));

jest.mock("./Part", () => () => <div data-testid="part" />);

describe("Subsection component", () => {
  test("renders", () => {
    render(
      <Provider store={store}>
        <Subsection subsectionId={"subsection 1"} />
      </Provider>
    );
    expect(screen.getByTestId("part")).toBeInTheDocument();
  });
});
