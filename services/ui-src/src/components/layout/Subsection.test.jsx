import React from "react";
import { render, screen } from "@testing-library/react";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import { mockInitialState } from "../../util/testing/testUtils";
import Subsection from "./Subsection";
import { selectSubsectionTitleAndPartIDs } from "../../store/selectors";

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
        partId: "mock-partId",
        partNumber: null,
        printView: undefined,
      })
    );
    const subSectionDivId = container.querySelector("#subsection-1");
    expect(subSectionDivId).toBeVisible();
  });

  test("assigns sequential partNumbers when there is more than one part", () => {
    mockPart.mockClear();
    selectSubsectionTitleAndPartIDs.mockReturnValueOnce({
      parts: ["mock-partId-1", "mock-partId-2", "mock-partId-3"],
      title: "Mock multi-part title",
      text: "Mock multi-part hint",
    });

    render(
      <Provider store={store}>
        <Subsection subsectionId={"subsection-1"} />
      </Provider>
    );

    expect(mockPart).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ partId: "mock-partId-1", partNumber: 1 })
    );
    expect(mockPart).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ partId: "mock-partId-2", partNumber: 2 })
    );
    expect(mockPart).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ partId: "mock-partId-3", partNumber: 3 })
    );
  });
});
