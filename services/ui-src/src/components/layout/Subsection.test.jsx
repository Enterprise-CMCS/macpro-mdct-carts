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
      parts: ["mock-partId"],
      title: "Mock part title",
      text: "Mock part hint",
    }),
}));

const mockPart = jest.fn(() => <div data-testid="part" />);
jest.mock("./Part", () => (props) => mockPart(props));

describe("Subsection component", () => {
  test("renders", () => {
    const { container } = render(
      <Provider store={store}>
        <Subsection subsectionId={"subsection-1"} />
      </Provider>
    );
    expect(
      screen.getByRole("heading", { name: "Mock part title" })
    ).toBeVisible();
    expect(screen.getByText("Mock part hint")).toBeVisible();
    expect(mockPart).toHaveBeenCalledWith(
      expect.objectContaining({
        nestedSubsectionTitle: true,
        partId: "mock-partId",
        partNumber: null,
        printView: undefined,
      })
    );
    const subSectionDivId = container.querySelector("#subsection-1");
    expect(subSectionDivId).toBeVisible();
  });
});
