import * as synthesize from "./synthesize";
import { hideIfTableValue, shouldDisplay } from "./shouldDisplay";
import { selectFragmentById } from "../store/formData";

const mockFragmentResult = {
  answer: { entry: "test program" },
};
jest.mock("../store/formData", () => ({
  ...jest.requireActual("../store/formData"),
  selectFragmentById: jest.fn(),
}));

jest.mock("./synthesize", () => ({
  ...jest.requireActual("./synthesize"),
  compareACS: jest.fn(),
  lookupChipEnrollments: jest.fn(),
  compareChipEnrollements: jest.fn(),
}));

describe("shouldDisplay()", () => {
  beforeEach(() => jest.clearAllMocks());

  test("should display everything if no context is provided", () => {
    const state = {
      stateUser: {
        currentUser: {
          role: "test role",
        },
      },
    };
    const result = shouldDisplay(state, null);
    expect(result).toBe(true);
  });

  test("should display everything if the context requires it", () => {
    const state = {
      stateUser: {
        currentUser: {
          role: "test role",
        },
      },
      formData: [
        {
          stateId: "CO",
          year: "2023",
        },
      ],
      reportStatus: {
        CO2023: {
          programType: "test program",
        },
      },
    };
    const context = {
      conditional_display: null,
      show_if_state_program_type_in: null,
    };
    const result = shouldDisplay(state, context);
    expect(result).toBe(true);
  });

  test("should not display if programs are specified, and this isn't one of them", () => {
    const state = {
      stateUser: {
        currentUser: {
          role: "test role",
        },
      },
      formData: [
        {
          stateId: "CO",
          year: "2023",
        },
      ],
      reportStatus: {
        CO2023: {
          programType: "test program",
        },
      },
    };
    const context = {
      conditional_display: null,
      show_if_state_program_type_in: ["a different program"],
    };
    const result = shouldDisplay(
      state.stateUser.currentUser.role,
      state.formData,
      state.reportStatus,
      null,
      null,
      null,
      context
    );
    expect(result).toBe(false);
  });

  test("should display specified programs", () => {
    const state = {
      stateUser: {
        currentUser: {
          role: "test role",
        },
      },
      formData: [
        {
          stateId: "CO",
          year: "2023",
        },
      ],
      reportStatus: {
        CO2023: {
          programType: "test program",
        },
      },
    };
    const context = {
      conditional_display: null,
      show_if_state_program_type_in: ["test program"],
    };
    const result = shouldDisplay(
      state.stateUser.currentUser.role,
      state.formData,
      state.reportStatus,
      null,
      null,
      null,
      context
    );
    expect(result).toBe(true);
  });

  test("should find programType for state users", () => {
    selectFragmentById.mockReturnValueOnce(mockFragmentResult);
    const state = {
      stateUser: {
        currentUser: {
          role: "test role",
        },
      },
      formData: [
        {
          stateId: "CO",
          year: "2023",
        },
      ],
      reportStatus: {
        CO2023: {
          programType: "test program",
        },
      },
    };
    const context = {
      conditional_display: null,
      show_if_state_program_type_in: ["test program"],
    };
    const result = shouldDisplay(
      state.stateUser.currentUser.role,
      state.formData,
      state.reportStatus,
      null,
      null,
      null,
      context
    );
    expect(result).toBe(true);
    expect(selectFragmentById).toHaveBeenCalledTimes(1);
  });

  test("should find programType for non-state users", () => {
    selectFragmentById.mockReturnValueOnce(mockFragmentResult);
    const state = {
      stateUser: {
        currentUser: {
          role: "test role",
        },
      },
      formData: [
        {
          stateId: "CO",
          year: "2023",
        },
      ],
      reportStatus: {
        CO2023: {
          programType: "test program",
        },
      },
    };
    const context = {
      conditional_display: null,
      show_if_state_program_type_in: ["test program"],
    };
    const result = shouldDisplay(
      state.stateUser.currentUser.role,
      state.formData,
      state.reportStatus,
      null,
      null,
      null,
      context
    );
    expect(result).toBe(true);
    expect(selectFragmentById).toHaveBeenCalledTimes(1);
  });

  test("should find programType from previous year if not in current year", () => {
    selectFragmentById.mockReturnValueOnce({});
    selectFragmentById.mockReturnValueOnce(mockFragmentResult);
    const state = {
      stateUser: {
        currentUser: {
          role: "test role",
        },
      },
      formData: [
        {
          stateId: "CO",
          year: "2023",
        },
      ],
      reportStatus: {
        CO2023: {
          programType: "test program",
        },
      },
    };
    const context = {
      conditional_display: null,
      show_if_state_program_type_in: ["test program"],
    };
    const result = shouldDisplay(
      state.stateUser.currentUser.role,
      state.formData,
      state.reportStatus,
      null,
      null,
      null,
      context
    );
    expect(result).toBe(true);
    expect(selectFragmentById).toHaveBeenCalledTimes(2);
  });

  test("should not display if hide_if logic is specified, and the state satisfies it", () => {
    const state = {
      stateUser: {
        currentUser: {
          role: "test role",
        },
      },
      formData: {
        foo: {
          bar: "baz",
        },
      },
    };
    const context = {
      conditional_display: {
        hide_if: {
          target: "$.foo.bar",
          values: {
            interactive: ["baz"],
          },
        },
      },
    };
    const result = shouldDisplay(
      state.stateUser.currentUser.role,
      state.formData,
      null,
      null,
      null,
      null,
      context
    );
    expect(result).toBe(false);
  });

  test("should display if hide_if logic is specified, and the state fails it", () => {
    const state = {
      stateUser: {
        currentUser: {
          role: "test role",
        },
      },
      formData: {
        foo: {
          bar: "quux",
        },
      },
    };
    const context = {
      conditional_display: {
        hide_if: {
          target: "$.foo.bar",
          values: {
            interactive: ["baz"],
          },
        },
      },
    };
    const result = shouldDisplay(
      state.stateUser.currentUser.role,
      state.formData,
      state.reportStatus,
      null,
      null,
      null,
      context
    );
    expect(result).toBe(true);
  });

  test("should not display if hide_if_all logic is specified, and the state satisfies it", () => {
    const state = {
      stateUser: {
        currentUser: {
          role: "test role",
        },
      },
      formData: {
        foo: {
          // All of these are in values.interactive
          bar: "baz",
          bbr: "bbz",
          bcr: "baz",
        },
      },
    };
    const context = {
      conditional_display: {
        hide_if_all: {
          targets: ["$.foo.bar", "$.foo.bbr", "$.foo.bcr"],
          values: {
            interactive: ["baz", "bbz"],
          },
        },
      },
    };
    const result = shouldDisplay(
      state.stateUser.currentUser.role,
      state.formData,
      state.reportStatus,
      null,
      null,
      null,
      context
    );
    expect(result).toBe(false);
  });

  test("should display if hide_if_all logic is specified, and the state fails it", () => {
    const state = {
      stateUser: {
        currentUser: {
          role: "test role",
        },
      },
      formData: {
        foo: {
          // One of these is not in values.interactive
          bar: "baz",
          bbr: "bbz",
          bcr: "quux",
        },
      },
    };
    const context = {
      conditional_display: {
        hide_if_all: {
          targets: ["$.foo.bar", "$.foo.bbr", "$.foo.bcr"],
          values: {
            interactive: ["baz", "bbz"],
          },
        },
      },
    };
    const result = shouldDisplay(
      state.stateUser.currentUser.role,
      state.formData,
      state.reportStatus,
      null,
      null,
      null,
      context
    );
    expect(result).toBe(true);
  });

  test("should not display if hide_if_not logic is specified, and the state satisfies it", () => {
    const state = {
      stateUser: {
        currentUser: {
          role: "test role",
        },
      },
      formData: {
        foo: {
          // At least one of these is in values.interactive
          bar: ["baz", "quux"],
        },
      },
    };
    const context = {
      conditional_display: {
        hide_if_not: {
          target: "$.foo.bar",
          values: {
            interactive: ["baz"],
          },
        },
      },
    };
    const result = shouldDisplay(
      state.stateUser.currentUser.role,
      state.formData,
      state.reportStatus,
      null,
      null,
      null,
      context
    );
    expect(result).toBe(true);
  });

  test("should display if hide_if_not logic is specified, and the state fails it", () => {
    const state = {
      stateUser: {
        currentUser: {
          role: "test role",
        },
      },
      formData: {
        foo: {
          // None of these are in values.interactive
          bar: ["corge", "quux"],
        },
      },
    };
    const context = {
      conditional_display: {
        hide_if_not: {
          target: "$.foo.bar",
          values: {
            interactive: ["baz"],
          },
        },
      },
    };
    const result = shouldDisplay(
      state.stateUser.currentUser.role,
      state.formData,
      state.reportStatus,
      null,
      null,
      null,
      context
    );
    expect(result).toBe(false);
  });

  test("should display by default when no display logic can be found", () => {
    const state = {
      stateUser: {
        currentUser: {
          role: "test role",
        },
      },
    };
    const context = {
      conditional_display: {},
    };
    const result = shouldDisplay(
      state.stateUser.currentUser.role,
      null,
      null,
      null,
      null,
      null,
      context
    );
    expect(result).toBe(true);
  });
  describe("hideIfTableValue", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    const makeContext = (variations, variation_operator = "and") => ({
      conditional_display: {
        hide_if_table_value: {
          target: "$",
          variations,
          variation_operator,
        },
      },
    });

    describe.each([
      {
        description: "all conditions satisfied with 'and'",
        formData: [[10, 20]],
        variations: [
          { operator: ">", row: "*", row_key: 0, threshold: 5 },
          { operator: ">", row: "*", row_key: 1, threshold: 15 },
        ],
        expected: true,
        operator: "and",
      },
      {
        description: "any condition fails with 'and'",
        formData: [[2, 20]],
        variations: [
          { operator: ">", row: "*", row_key: 0, threshold: 5 },
          { operator: ">", row: "*", row_key: 1, threshold: 15 },
        ],
        expected: false,
        operator: "and",
      },
      {
        description: "multiple rows satisfied with 'and'",
        formData: [
          [10, 20],
          [30, 5],
        ],
        variations: [
          { operator: ">", row: 0, row_key: 0, threshold: 5 },
          { operator: "<", row: 1, row_key: 1, threshold: 10 },
        ],
        expected: true,
        operator: "and",
      },
      {
        description: "any row fails with 'and'",
        formData: [
          [2, 20],
          [30, 15],
        ],
        variations: [
          { operator: ">", row: 0, row_key: 0, threshold: 5 },
          { operator: "<", row: 1, row_key: 1, threshold: 10 },
        ],
        expected: false,
        operator: "and",
      },
      {
        description: "comparisonValue !== threshold with 'or'",
        formData: [[5]],
        variations: [{ operator: "=", row: 0, row_key: 0, threshold: 10 }],
        expected: false,
        operator: "or",
      },
      {
        description: "comparisonValue !== threshold with 'and'",
        formData: [[5]],
        variations: [{ operator: "=", row: 0, row_key: 0, threshold: 10 }],
        expected: false,
        operator: "and",
      },
    ])("$description", ({ formData, variations, expected, operator }) => {
      test(`returns ${expected}`, () => {
        const context = makeContext(variations, operator);
        const result = hideIfTableValue(
          formData,
          [],
          null,
          [],
          context.conditional_display.hide_if_table_value
        );
        expect(result).toBe(expected);
      });
    });
  });
  describe("hideIfTableValue - computed branch", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    function testComputeField(
      fn,
      fieldName,
      returnValue,
      formData,
      options = {}
    ) {
      fn.mockReturnValue(returnValue);

      let args;
      switch (fieldName) {
        case "compareACS":
          args = [
            options.allStatesData || [{ state: "NY" }],
            "NY",
            formData[0][0][fieldName],
          ];
          break;
        case "lookupChipEnrollments":
        case "compareChipEnrollements":
          args = [
            options.chipEnrollments || [{ enrollment: "data" }],
            formData[0][0][fieldName],
          ];
          break;
        default:
          throw new Error(`Unknown compute field: ${fieldName}`);
      }

      const result = hideIfTableValue(
        formData,
        options.allStatesData || [{ state: "NY" }],
        "NY",
        options.chipEnrollments || [{ enrollment: "data" }],
        {
          computed: true,
          target: "$",
          variations: [
            { operator: "=", row: 0, row_key: 0, threshold: returnValue },
          ],
          variation_operator: "or",
        }
      );

      expect(fn).toHaveBeenCalledWith(...args);
      expect(result).toBe(true);
    }

    test("uses compareACS when item.compareACS exists", () => {
      testComputeField(synthesize.compareACS, "compareACS", 42, [
        [{ compareACS: "someACS" }],
      ]);
    });

    test("uses lookupChipEnrollments when item.lookupChipEnrollments exists", () => {
      testComputeField(
        synthesize.lookupChipEnrollments,
        "lookupChipEnrollments",
        99,
        [[{ lookupChipEnrollments: "someKey" }]],
        { chipEnrollments: [{ enrollment: "data" }] }
      );
    });

    test("uses compareChipEnrollements when item.compareChipEnrollements exists", () => {
      testComputeField(
        synthesize.compareChipEnrollements,
        "compareChipEnrollements",
        5,
        [[{ compareChipEnrollements: "key" }]],
        { chipEnrollments: [{ enrollment: "data" }] }
      );
    });

    test("passes through item if no compute fields exist", () => {
      const formData = [[10]];

      const result = hideIfTableValue(formData, [], "NY", [], {
        computed: true,
        target: "$",
        variations: [{ operator: "=", row: 0, row_key: 0, threshold: 10 }],
        variation_operator: "or",
      });

      expect(result).toBe(true);
    });

    test("should hide element if any != condition passes ('or')", () => {
      const formData = [[5, 10]];
      const result = hideIfTableValue(formData, [], "NY", [], {
        computed: false,
        target: "$",
        variations: [
          { operator: "!=", row: 0, row_key: 0, threshold: 5 },
          { operator: "!=", row: 0, row_key: 1, threshold: 99 },
        ],
        variation_operator: "or",
      });

      expect(result).toBe(true);
    });

    test("should hide element only if all != conditions pass ('and')", () => {
      const formData = [[5, 10]];
      const result = hideIfTableValue(formData, [], "NY", [], {
        computed: false,
        target: "$",
        variations: [
          { operator: "!=", row: 0, row_key: 0, threshold: 0 },
          { operator: "!=", row: 0, row_key: 1, threshold: 10 },
        ],
        variation_operator: "and",
      });

      expect(result).toBe(false);
    });

    test("unknown operator returns false ('or')", () => {
      const formData = [[5]];
      const result = hideIfTableValue(formData, [], "NY", [], {
        computed: false,
        target: "$",
        variations: [{ operator: "??", row: 0, row_key: 0, threshold: 5 }],
        variation_operator: "or",
      });

      expect(result).toBe(false);
    });

    test("unknown operator returns false ('and')", () => {
      const formData = [[5]];
      const result = hideIfTableValue(formData, [], "NY", [], {
        computed: false,
        target: "$",
        variations: [{ operator: "??", row: 0, row_key: 0, threshold: 5 }],
        variation_operator: "and",
      });

      expect(result).toBe(false);
    });
  });
});
