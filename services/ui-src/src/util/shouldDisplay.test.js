import { shouldDisplay } from "./shouldDisplay";
import { AppRoles } from "../types";
import { selectFragmentById } from "../store/formData";

const mockFragmentResult = {
  answer: { entry: "test program" },
};
jest.mock("../store/formData", () => ({
  ...jest.requireActual("../store/formData"),
  selectFragmentById: jest.fn(),
}));

describe("shouldDisplay", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should display everything for CMS Admins", () => {
    const state = {
      stateUser: {
        currentUser: {
          role: AppRoles.CMS_ADMIN,
        },
      },
    };
    const result = shouldDisplay(state, null, null);
    expect(result).toBe(true);
  });

  it("should display everything if no context is provided", () => {
    const state = {
      stateUser: {
        currentUser: {
          role: "test role",
        },
      },
    };
    const programType = "test program";
    const result = shouldDisplay(state, null, programType);
    expect(result).toBe(true);
  });

  it("should display everything if the context requires it", () => {
    const state = {
      stateUser: {
        currentUser: {
          role: "test role",
        },
      },
    };
    const context = {
      conditional_display: null,
      show_if_state_program_type_in: null,
    };
    const programType = "test program";
    const result = shouldDisplay(state, context, programType);
    expect(result).toBe(true);
  });

  it("should not display if programs are specified, and this isn't one of them", () => {
    const state = {
      stateUser: {
        currentUser: {
          role: "test role",
        },
      },
    };
    const context = {
      conditional_display: null,
      show_if_state_program_type_in: ["a different program"],
    };
    const programType = "test program";
    const result = shouldDisplay(state, context, programType);
    expect(result).toBe(false);
  });

  it("should display specified programs", () => {
    const state = {
      stateUser: {
        currentUser: {
          role: "test role",
        },
      },
    };
    const context = {
      conditional_display: null,
      show_if_state_program_type_in: ["test program"],
    };
    const programType = "test program";
    const result = shouldDisplay(state, context, programType);
    expect(result).toBe(true);
  });

  it("should find programType for state users", () => {
    selectFragmentById.mockReturnValueOnce(mockFragmentResult);
    const state = {
      global: {
        formYear: "2023",
      },
      stateUser: {
        abbr: "CO",
        currentUser: {
          role: AppRoles.STATE_USER,
        },
      },
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
    const programType = null;
    const result = shouldDisplay(state, context, programType);
    expect(result).toBe(true);
    expect(selectFragmentById).toHaveBeenCalledTimes(1);
  });

  it("should find programType for non-state users", () => {
    selectFragmentById.mockReturnValueOnce(mockFragmentResult);
    const state = {
      global: {
        formYear: "2023",
      },
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
    const programType = null;
    const result = shouldDisplay(state, context, programType);
    expect(result).toBe(true);
    expect(selectFragmentById).toHaveBeenCalledTimes(1);
  });

  it("should find programType from previous year if not in current year", () => {
    selectFragmentById.mockReturnValueOnce({});
    selectFragmentById.mockReturnValueOnce(mockFragmentResult);
    const state = {
      global: {
        formYear: "2023",
      },
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
    const programType = null;
    const result = shouldDisplay(state, context, programType);
    expect(result).toBe(true);
    expect(selectFragmentById).toHaveBeenCalledTimes(2);
  });

  it("should not display if hide_if logic is specified, and the state satisfies it", () => {
    const state = {
      stateUser: {
        currentUser: {
          role: "test role",
        },
      },
      foo: {
        bar: "baz",
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
    const programType = "test program";
    const result = shouldDisplay(state, context, programType);
    expect(result).toBe(false);
  });

  it("should display if hide_if logic is specified, and the state fails it", () => {
    const state = {
      stateUser: {
        currentUser: {
          role: "test role",
        },
      },
      foo: {
        bar: "quux",
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
    const programType = "test program";
    const result = shouldDisplay(state, context, programType);
    expect(result).toBe(true);
  });

  it("should not display if hide_if_all logic is specified, and the state satisfies it", () => {
    const state = {
      stateUser: {
        currentUser: {
          role: "test role",
        },
      },
      foo: {
        // All of these are in values.interactive
        bar: "baz",
        bbr: "bbz",
        bcr: "baz",
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
    const programType = "test program";
    const result = shouldDisplay(state, context, programType);
    expect(result).toBe(false);
  });

  it("should display if hide_if_all logic is specified, and the state fails it", () => {
    const state = {
      stateUser: {
        currentUser: {
          role: "test role",
        },
      },
      foo: {
        // One of these is not in values.interactive
        bar: "baz",
        bbr: "bbz",
        bcr: "quux",
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
    const programType = "test program";
    const result = shouldDisplay(state, context, programType);
    expect(result).toBe(true);
  });

  it("should not display if hide_if_not logic is specified, and the state satisfies it", () => {
    const state = {
      stateUser: {
        currentUser: {
          role: "test role",
        },
      },
      foo: {
        // At least one of these is in values.interactive
        bar: ["baz", "quux"],
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
    const programType = "test program";
    const result = shouldDisplay(state, context, programType);
    expect(result).toBe(true);
  });

  it("should display if hide_if_not logic is specified, and the state fails it", () => {
    const state = {
      stateUser: {
        currentUser: {
          role: "test role",
        },
      },
      foo: {
        // None of these are in values.interactive
        bar: ["corge", "quux"],
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
    const programType = "test program";
    const result = shouldDisplay(state, context, programType);
    expect(result).toBe(false);
  });

  it("should display by default when no display logic can be found", () => {
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
    const programType = "test program";
    const result = shouldDisplay(state, context, programType);
    expect(result).toBe(true);
  });
});
