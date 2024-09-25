import React from "react";
import { Provider } from "react-redux";
import { screen, render } from "@testing-library/react";
import configureMockStore from "redux-mock-store";
import SynthesizedValue from "./SynthesizedValue";
import { lteMask } from "../../util/constants";

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
  global: {
    stateName: "AL",
  },
  stateUser: {
    abbr: "CMS",
  },
  enrollmentCounts: {
    chipEnrollments: 0,
  },
  lastYearFormData: [],
  lastYearTotals: {},
});

const defaultProps = {
  question: {
    questions: [],
    fieldset_info: {
      actions: ["percentage"],
      targets: [
        "$..*[?(@ && @.id=='2023-03-i-02-01-01-05')].answer.entry",
        "$..*[?(@ && @.id=='2023-03-i-02-01-01-04')].answer.entry",
      ],
    },
    fieldset_type: "synthesized_value",
    type: "fieldset",
  },
};

const SynthesizedValueComponentWithProps = (testSpecificProps) => {
  return (
    <Provider store={store}>
      <SynthesizedValue {...defaultProps} {...testSpecificProps} />
    </Provider>
  );
};

describe("<Synthesized Value />", () => {
  test("should render header and labels", () => {
    render(SynthesizedValueComponentWithProps());

    expect(screen.getByText("Computed:")).toBeInTheDocument();
  });

  test("should not render in print view with lessThanEleven mask prop", () => {
    render(
      SynthesizedValueComponentWithProps({
        question: {
          ...defaultProps.question,
          fieldset_info: {
            ...defaultProps.fieldset_info,
            mask: lteMask,
          },
        },
        printView: true,
      })
    );

    expect(screen.queryByText("Computed:")).not.toBeInTheDocument();
  });
});
