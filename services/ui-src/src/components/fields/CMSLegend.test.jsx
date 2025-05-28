import React from "react";
import CMSLegend from "./CMSLegend";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { screen, render } from "@testing-library/react";

const mockStore = configureMockStore();
const store = mockStore({});
const buildLegend = (legendProps) => {
  return (
    <Provider store={store}>
      <CMSLegend {...legendProps} />
    </Provider>
  );
};

describe("CMS Legend", () => {
  it.each([
    ["text", false],
    ["mailing_address", false],
    ["phone_number", false],
    ["email", false],
    ["percentage", true],
    ["radio", true],
    ["fieldset", true],
  ])(
    "Question type %s should show or hide legend, and allow hints if rendered",
    (questionType, expected) => {
      render(
        buildLegend({
          hideNumber: false,
          hint: "hint",
          id: "2022-0-1-1a",
          label: "Label",
          questionType: questionType,
        })
      );
      const legend = screen.queryByTestId("question-legend");
      if (expected) {
        expect(legend).not.toBeNull();
        let hint = screen.getByTestId("legend-hint");
        expect(hint).not.toBeNull();
      } else {
        expect(legend).toBeNull();
      }
    }
  );

  it("Hint should hide when not provided", () => {
    render(
      buildLegend({
        hideNumber: false,
        id: "2022-0-1-1a",
        label: "Label",
        questionType: "radio",
      })
    );
    const hint = screen.queryByTestId("legend-hint");
    expect(hint).toBeNull();
  });
});
