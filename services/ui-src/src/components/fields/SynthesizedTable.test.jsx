import React from "react";
import { Provider } from "react-redux";
import { screen, render } from "@testing-library/react";
import configureMockStore from "redux-mock-store";
import { lteMask } from "../../util/constants";
import SynthesizedTable from "./SynthesizedTable";

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
  tableTitle: "Managed Care Costs",
  question: {
    questions: [],
    fieldset_info: {
      rows: [
        [
          {
            contents: "Eligible children",
          },
          {
            actions: ["identity"],
            targets: ["$..*[?(@ && @.id=='2023-05-a-03-01-a')].answer.entry"],
          },
          {
            actions: ["identity"],
            targets: ["$..*[?(@ && @.id=='2023-05-a-03-01-b')].answer.entry"],
          },
        ],
      ],
      headers: [
        {
          contents: "",
        },
        {
          contents: "FFY 2023",
        },
        {
          contents: "FFY 2024",
        },
      ],
    },
    fieldset_type: "synthesized_table",
    type: "fieldset",
  },
};

const SynthesizedTableComponentWithProps = (testSpecificProps) => {
  return (
    <Provider store={store}>
      <SynthesizedTable {...defaultProps} {...testSpecificProps} />
    </Provider>
  );
};

describe("<SynthesizedTable />", () => {
  test("should render header and labels", () => {
    render(SynthesizedTableComponentWithProps());

    expect(screen.getByText("FFY 2023")).toBeInTheDocument();
    expect(screen.getByText("FFY 2024")).toBeInTheDocument();
    expect(screen.getByText("Eligible children")).toBeInTheDocument();
  });

  test("should not render in print view with lessThanEleven mask prop", () => {
    render(
      SynthesizedTableComponentWithProps({
        question: {
          ...defaultProps.question,
          fieldset_info: {
            rows: [
              [
                {
                  contents: "Eligible children",
                  mask: lteMask,
                },
                {
                  mask: lteMask,
                  actions: ["identity"],
                  targets: [
                    "$..*[?(@ && @.id=='2023-05-a-03-01-a')].answer.entry",
                  ],
                },
                {
                  mask: lteMask,
                  actions: ["identity"],
                  targets: [
                    "$..*[?(@ && @.id=='2023-05-a-03-01-b')].answer.entry",
                  ],
                },
              ],
            ],
            headers: [
              {
                mask: lteMask,
                contents: "",
              },
              {
                mask: lteMask,
                contents: "FFY 2023",
              },
              {
                mask: lteMask,
                contents: "FFY 2024",
              },
            ],
          },
        },
        printView: true,
      })
    );

    expect(screen.queryByText("FFY 2023")).not.toBeInTheDocument();
    expect(screen.queryByText("FFY 2024")).not.toBeInTheDocument();
    expect(screen.queryByText("Eligible children")).not.toBeInTheDocument();
  });
});
