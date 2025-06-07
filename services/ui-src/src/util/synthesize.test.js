// TODO: Fix this testing suite, it is outdated

import synthesize from "../util/synthesize";

const state = {
  global: {
    stateName: "Alabama",
  },
  allStatesData: [
    {
      name: "Alabama",
      programNames: {},
      programType: "combo",
      code: "AL",
      fmapSet: [],
      acsSet: [
        {
          percentUninsured: "2.1",
          numberUninsuredMoe: 4000,
          year: 2021,
          percentUninsuredMoe: "0.3",
          stateId: "AL",
          numberUninsured: 27000,
        },
        {
          percentUninsured: "3.1",
          numberUninsuredMoe: 5000,
          year: 2020,
          percentUninsuredMoe: "0.3",
          stateId: "AL",
          numberUninsured: 28000,
        },
      ],
    },
  ],
  stateUser: {
    abbr: "AL",
  },
  formData: [
    {
      id: "section1",
      items: [
        {
          id: "item0",
          answer: { entry: "0" },
        },
        {
          id: "item1",
          answer: { entry: "1" },
        },
        {
          id: "item2",
          answer: { entry: "2" },
        },
        {
          id: "item3",
          answer: { entry: "3" },
        },
        {
          id: "item4",
          answer: { entry: "4" },
        },
        {
          id: "item5",
          answer: { entry: "5" },
        },
        {
          id: "item6",
          answer: { entry: null },
        },
        {
          id: "item7",
          answer: { entry: "abc" },
        },
        {
          id: "item8",
          answer: { entry: "1,001" },
        },
      ],
    },
  ],
  enrollmentCounts: {
    chipEnrollments: [
      {
        pk: "AL-2022",
        entryKey: "medicaid_exp_chip-1",
        indexToUpdate: 1,
        stateId: "AL",
        typeOfEnrollment: "Medicaid Expansion CHIP",
        enrollmentCount: 301,
        filterId: "2022-02",
        yearToModify: "2022",
      },
      {
        pk: "AL-2022",
        entryKey: "medicaid_exp_chip-2",
        indexToUpdate: 2,
        stateId: "AL",
        typeOfEnrollment: "Medicaid Expansion CHIP",
        enrollmentCount: 333,
        filterId: "2022-02",
        yearToModify: "2022",
      },
    ],
  },
};

const fallbackChipState = {
  enrollmentCounts: {
    chipEnrollments: [
      {
        pk: "AL-2021",
        entryKey: "medicaid_exp_chip-2",
        indexToUpdate: 2,
        stateId: "AL",
        typeOfEnrollment: "Medicaid Expansion CHIP",
        enrollmentCount: 301,
        filterId: "2021-02",
        yearToModify: "2021",
      },
      {
        pk: "AL-2022",
        entryKey: "medicaid_exp_chip-2",
        indexToUpdate: 2,
        stateId: "AL",
        typeOfEnrollment: "Medicaid Expansion CHIP",
        enrollmentCount: 333,
        filterId: "2022-02",
        yearToModify: "2022",
      },
    ],
  },
};

describe("synthesize()", () => {
  describe("handles identity", () => {
    test("with no values", () => {
      // Returns undefined, because there's not a value
      const out = synthesize(
        {
          targets: [],
          actions: ["identity"],
        },
        state.allStatesData,
        state.global.stateName,
        state.stateUser.abbr,
        state.enrollmentCounts.chipEnrollments,
        state.formData
      );
      expect(out).toEqual({ contents: undefined });
    });

    test("with multiple values", () => {
      // Returns the first value
      const out = synthesize(
        {
          targets: [
            "$..*[?(@ && @.id==='item3')].answer.entry",
            "$..*[?(@ && @.id==='item4')].answer.entry",
          ],
          actions: ["identity"],
        },
        state.allStatesData,
        state.global.stateName,
        state.stateUser.abbr,
        state.enrollmentCounts.chipEnrollments,
        state.formData
      );
      expect(out).toEqual({ contents: "3" });
    });
  });

  describe("handles sums", () => {
    test("with a string in it", () => {
      // Non-stringy numbers are NaN, so the math is NaN
      const out = synthesize(
        {
          targets: [
            "$..*[?(@ && @.id==='item1')].answer.entry",
            "$..*[?(@ && @.id==='item3')].answer.entry",
            "$..*[?(@ && @.id==='item7')].answer.entry",
          ],
          actions: ["sum"],
        },
        state.allStatesData,
        state.global.stateName,
        state.stateUser.abbr,
        state.enrollmentCounts.chipEnrollments,
        state.formData
      );
      expect(out).toEqual({ contents: NaN });
    });

    test("with a value that doesn't exist", () => {
      // Undefined is undefined, so the math is NaN
      const out = synthesize(
        {
          targets: [
            "$..*[?(@ && @.id==='item1')].answer.entry",
            "$..*[?(@ && @.id==='item3')].answer.entry",
            "$..*[?(@ && @.id==='item100')].answer.entry",
          ],
          actions: ["sum"],
        },
        state.allStatesData,
        state.global.stateName,
        state.stateUser.abbr,
        state.enrollmentCounts.chipEnrollments,
        state.formData
      );
      expect(out).toEqual({ contents: NaN });
    });

    test("with a null value", () => {
      // Null gets coalesced to zero, so the sum should work
      const out = synthesize(
        {
          targets: [
            "$..*[?(@ && @.id==='item1')].answer.entry",
            "$..*[?(@ && @.id==='item3')].answer.entry",
            "$..*[?(@ && @.id==='item6')].answer.entry",
          ],
          actions: ["sum"],
        },
        state.allStatesData,
        state.global.stateName,
        state.stateUser.abbr,
        state.enrollmentCounts.chipEnrollments,
        state.formData
      );
      expect(out).toEqual({ contents: 4 });
    });

    test("with multiple valid values", () => {
      // Adds 'em up
      const out = synthesize(
        {
          targets: [
            "$..*[?(@ && @.id==='item1')].answer.entry",
            "$..*[?(@ && @.id==='item3')].answer.entry",
            "$..*[?(@ && @.id==='item5')].answer.entry",
          ],
          actions: ["sum"],
        },
        state.allStatesData,
        state.global.stateName,
        state.stateUser.abbr,
        state.enrollmentCounts.chipEnrollments,
        state.formData
      );
      expect(out).toEqual({ contents: 9 });
    });

    test("with string values", () => {
      // Adds 'em up
      const out = synthesize(
        {
          targets: [
            "$..*[?(@ && @.id==='item8')].answer.entry",
            "$..*[?(@ && @.id==='item6')].answer.entry",
            "$..*[?(@ && @.id==='item1')].answer.entry",
          ],
          actions: ["sum"],
        },
        state.allStatesData,
        state.global.stateName,
        state.stateUser.abbr,
        state.enrollmentCounts.chipEnrollments,
        state.formData
      );
      expect(out).toEqual({ contents: 1002 });
    });

    test("with string and undefined values", () => {
      // Adds 'em up
      const out = synthesize(
        {
          targets: [
            "$..*[?(@ && @.id==='item8')].answer.entry",
            "$..*[?(@ && @.id==='item6')].answer.entry",
            "$..*[?(@ && @.id==='item100')].answer.entry",
          ],
          actions: ["sum"],
        },
        state.allStatesData,
        state.global.stateName,
        state.stateUser.abbr,
        state.enrollmentCounts.chipEnrollments,
        state.formData
      );
      expect(out).toEqual({ contents: NaN });
    });
  });

  describe("handles percentages", () => {
    test("with only one value", () => {
      // No denominator, no percenator
      const out = synthesize(
        {
          targets: ["$..*[?(@ && @.id==='item4')].answer.entry"],
          actions: ["percentage"],
        },
        state.allStatesData,
        state.global.stateName,
        state.stateUser.abbr,
        state.enrollmentCounts.chipEnrollments,
        state.formData
      );
      expect(out).toEqual({ contents: "" });
    });

    test("with a zero denominator", () => {
      // Zero denominator, no percenator
      const out = synthesize(
        {
          targets: [
            "$..*[?(@ && @.id==='item4')].answer.entry",
            "$..*[?(@ && @.id==='item0')].answer.entry",
          ],
          actions: ["percentage"],
        },
        state.allStatesData,
        state.global.stateName,
        state.stateUser.abbr,
        state.enrollmentCounts.chipEnrollments,
        state.formData
      );
      expect(out).toEqual({ contents: "" });
    });

    test("with a valid division, no set precision", () => {
      // Defaults to two decimal point precision
      const out = synthesize(
        {
          targets: [
            "$..*[?(@ && @.id==='item1')].answer.entry",
            "$..*[?(@ && @.id==='item3')].answer.entry",
          ],
          actions: ["percentage"],
        },
        state.allStatesData,
        state.global.stateName,
        state.stateUser.abbr,
        state.enrollmentCounts.chipEnrollments,
        state.formData
      );
      expect(out).toEqual({ contents: "33.33%" });
    });

    test("with a valid division, 4-decimal precision", () => {
      // Uses configured precision
      const out = synthesize(
        {
          targets: [
            "$..*[?(@ && @.id==='item1')].answer.entry",
            "$..*[?(@ && @.id==='item3')].answer.entry",
          ],
          actions: ["percentage"],
          precision: 4,
        },
        state.allStatesData,
        state.global.stateName,
        state.stateUser.abbr,
        state.enrollmentCounts.chipEnrollments,
        state.formData
      );
      expect(out).toEqual({ contents: "33.3333%" });
    });

    test("with a valid division, no decimals", () => {
      // Uses configured precision
      const out = synthesize(
        {
          targets: [
            "$..*[?(@ && @.id==='item1')].answer.entry",
            "$..*[?(@ && @.id==='item3')].answer.entry",
          ],
          actions: ["percentage"],
          precision: 0,
        },
        state.allStatesData,
        state.global.stateName,
        state.stateUser.abbr,
        state.enrollmentCounts.chipEnrollments,
        state.formData
      );
      expect(out).toEqual({ contents: "33%" });
    });

    test("with a valid division, negative precision", () => {
      // Uses the default for invalid precisions
      const out = synthesize(
        {
          targets: [
            "$..*[?(@ && @.id==='item1')].answer.entry",
            "$..*[?(@ && @.id==='item3')].answer.entry",
          ],
          actions: ["percentage"],
          precision: -3,
        },
        state.allStatesData,
        state.global.stateName,
        state.stateUser.abbr,
        state.enrollmentCounts.chipEnrollments,
        state.formData
      );
      expect(out).toEqual({ contents: "33.33%" });
    });
  });

  describe("handles RPNs", () => {
    test("with too few operands", () => {
      /*
       * "", because there's an operator with nothing to operate on. This
       * assumes that all of our operators are binary, not unary.
       */
      const out = synthesize(
        {
          targets: [
            "$..*[?(@ && @.id==='item1')].answer.entry",
            "$..*[?(@ && @.id==='item3')].answer.entry",
          ],
          actions: ["rpn"],
          rpn: "@ @ + + -",
        },
        state.allStatesData,
        state.global.stateName,
        state.stateUser.abbr,
        state.enrollmentCounts.chipEnrollments,
        state.formData
      );

      expect(out).toEqual({ contents: "" });
    });

    test("with extra operands", () => {
      // The extra ones get ignored.
      const out = synthesize(
        {
          targets: [
            "$..*[?(@ && @.id==='item1')].answer.entry",
            "$..*[?(@ && @.id==='item3')].answer.entry",
            "$..*[?(@ && @.id==='item1')].answer.entry",
            "$..*[?(@ && @.id==='item3')].answer.entry",
          ],
          actions: ["rpn"],
          rpn: "@ @ +",
        },
        state.allStatesData,
        state.global.stateName,
        state.stateUser.abbr,
        state.enrollmentCounts.chipEnrollments,
        state.formData
      );

      expect(out).toEqual({ contents: 4 });
    });

    test("with any value NaN", () => {
      /*
       * There are too many @ tokens, so the last one resolves to NaN. Now the
       * whole result should be NaN as well.
       */
      const out = synthesize(
        {
          targets: [
            "$..*[?(@ && @.id==='item1')].answer.entry",
            "$..*[?(@ && @.id==='item2')].answer.entry",
            "$..*[?(@ && @.id==='item3')].answer.entry",
            "$..*[?(@ && @.id==='item4')].answer.entry",
          ],
          actions: ["rpn"],
          rpn: "@ @ @ @ @ - + * /",
        },
        state.allStatesData,
        state.global.stateName,
        state.stateUser.abbr,
        state.enrollmentCounts.chipEnrollments,
        state.formData
      );

      expect(out).toEqual({ contents: NaN });
    });

    test("with addition, subtraction, division, and multiplication", () => {
      // Does it right!
      const out = synthesize(
        {
          targets: [
            "$..*[?(@ && @.id==='item1')].answer.entry",
            "$..*[?(@ && @.id==='item2')].answer.entry",
            "$..*[?(@ && @.id==='item3')].answer.entry",
            "$..*[?(@ && @.id==='item4')].answer.entry",
            "$..*[?(@ && @.id==='item5')].answer.entry",
          ],
          actions: ["rpn"],
          rpn: "@ @ @ @ @ - + * /",
        },
        state.allStatesData,
        state.global.stateName,
        state.stateUser.abbr,
        state.enrollmentCounts.chipEnrollments,
        state.formData
      );

      expect(out).toEqual({ contents: 1.6 });
    });

    test("with constants", () => {
      // Does it right!
      const out = synthesize(
        {
          targets: [
            "$..*[?(@ && @.id==='item1')].answer.entry",
            "$..*[?(@ && @.id==='item2')].answer.entry",
            "$..*[?(@ && @.id==='item3')].answer.entry",
          ],
          actions: ["rpn"],
          rpn: "@ @ @ 2 + + *",
        },
        state.allStatesData,
        state.global.stateName,
        state.stateUser.abbr,
        state.enrollmentCounts.chipEnrollments,
        state.formData
      );

      expect(out).toEqual({ contents: 12 });
    });

    test("with not-actually a postfix notation because...", () => {
      /*
       * The operands and operators are parsed from the RPN string separately
       * and then applied in their respective orders. As a result, it doesn't
       * matter what order they are with respect to each other, as long as
       * operands and operators are ordered amongst themselves.
       */
      const out = synthesize(
        {
          targets: [
            "$..*[?(@ && @.id==='item1')].answer.entry",
            "$..*[?(@ && @.id==='item2')].answer.entry",
            "$..*[?(@ && @.id==='item3')].answer.entry",
            "$..*[?(@ && @.id==='item4')].answer.entry",
            "$..*[?(@ && @.id==='item5')].answer.entry",
          ],
          actions: ["rpn"],
          rpn: "- + @ @ * / @ @ @",
        },
        state.allStatesData,
        state.global.stateName,
        state.stateUser.abbr,
        state.enrollmentCounts.chipEnrollments,
        state.formData
      );

      expect(out).toEqual({ contents: 1.6 });
    });
  });

  describe("handles ACS Data", () => {
    test("handles a lookup for a ffy and property", () => {
      const out = synthesize(
        {
          lookupAcs: {
            ffy: 2021,
            acsProperty: "numberUninsured",
          },
        },
        state.allStatesData,
        state.global.stateName,
        state.stateUser.abbr,
        state.enrollmentCounts.chipEnrollments,
        state.formData
      );
      expect(out).toEqual({ contents: ["27,000"] });
    });

    test("returns results for properties in other cases", () => {
      const out = synthesize(
        {
          lookupAcs: {
            ffy: 2021,
            acsProperty: "number_uninsured",
          },
        },
        state.allStatesData,
        state.global.stateName,
        state.stateUser.abbr,
        state.enrollmentCounts.chipEnrollments,
        state.formData
      );
      expect(out).toEqual({ contents: ["27,000"] });
    });

    test("returns 'Not Available' when no data found", () => {
      const out = synthesize(
        {
          lookupAcs: {
            ffy: 2555,
            acsProperty: "cyborgsCreated",
          },
        },
        state.allStatesData,
        state.global.stateName,
        state.stateUser.abbr,
        state.enrollmentCounts.chipEnrollments,
        state.formData
      );
      expect(out).toEqual({ contents: ["Not Available"] });
      const outCompare = synthesize(
        {
          compareACS: {
            ffy1: 2555,
            ffy2: 1900,
            acsProperty: "cyborgsCreated",
          },
        },
        state.allStatesData,
        state.global.stateName,
        state.stateUser.abbr,
        state.enrollmentCounts.chipEnrollments,
        state.formData
      );
      expect(outCompare).toEqual({ contents: ["Not Available"] });
    });

    test("formats percents on lookup", () => {
      const out = synthesize(
        {
          lookupAcs: {
            ffy: 2021,
            acsProperty: "percentUninsured",
          },
        },
        state.allStatesData,
        state.global.stateName,
        state.stateUser.abbr,
        state.enrollmentCounts.chipEnrollments,
        state.formData
      );
      expect(out).toEqual({ contents: ["2.1%"] });
    });

    test("compares two ffys", () => {
      const out = synthesize(
        {
          compareACS: {
            ffy1: 2021,
            ffy2: 2020,
            acsProperty: "numberUninsured",
          },
        },
        state.allStatesData,
        state.global.stateName,
        state.stateUser.abbr,
        state.enrollmentCounts.chipEnrollments,
        state.formData
      );
      expect(out).toEqual({ contents: ["3.70%"] });
    });

    test("compares two ffys as admin user", () => {
      Object.defineProperty(window, "location", {
        value: {
          pathname: "/views/sections/AL/2023/02",
        },
      });
      const out = synthesize(
        {
          compareACS: {
            ffy1: 2021,
            ffy2: 2020,
            acsProperty: "numberUninsured",
          },
        },
        state.allStatesData,
        state.global.stateName,
        undefined, // state user abbreviation
        state.enrollmentCounts.chipEnrollments,
        state.formData
      );
      expect(out).toEqual({ contents: ["3.70%"] });
    });
  });

  describe("handles CHIPS Enrollment Data", () => {
    test("performs a lookup for a given year", () => {
      const out = synthesize(
        {
          lookupChipEnrollments: {
            ffy: 2022,
            enrollmentType: "Medicaid Expansion CHIP",
            index: 2,
          },
        },
        state.allStatesData,
        state.global.stateName,
        state.stateUser.abbr,
        state.enrollmentCounts.chipEnrollments,
        state.formData
      );
      expect(out).toEqual({ contents: ["333"] });
    });
    test("performs a lookup for a past years data if current year does not provide it", () => {
      const out = synthesize(
        {
          lookupChipEnrollments: {
            ffy: 2022,
            enrollmentType: "Medicaid Expansion CHIP",
            index: 1,
          },
        },
        state.allStatesData,
        state.global.stateName,
        state.stateUser.abbr,
        fallbackChipState.enrollmentCounts.chipEnrollments,
        state.formData
      );
      expect(out).toEqual({ contents: ["301"] });
    });
    test("performs a comparison between two years", () => {
      const out = synthesize(
        {
          compareChipEnrollements: {
            ffy: 2022,
            enrollmentType: "Medicaid Expansion CHIP",
          },
        },
        state.allStatesData,
        state.global.stateName,
        state.stateUser.abbr,
        state.enrollmentCounts.chipEnrollments,
        state.formData
      );
      expect(out).toEqual({ contents: ["10.631%"] });
    });

    test("performs a comparison between two years and is able to fall back to past data", () => {
      const out = synthesize(
        {
          compareChipEnrollements: {
            ffy: 2022,
            enrollmentType: "Medicaid Expansion CHIP",
          },
        },
        state.allStatesData,
        state.global.stateName,
        state.stateUser.abbr,
        fallbackChipState.enrollmentCounts.chipEnrollments,
        state.formData
      );
      expect(out).toEqual({ contents: ["10.631%"] });
    });
    test("returns Not Available when data is missing", () => {
      const out = synthesize(
        {
          compareChipEnrollements: {
            ffy: 2050,
            enrollmentType: "Medicaid Expansion CHIP",
          },
        },
        state.allStatesData,
        state.global.stateName,
        state.stateUser.abbr,
        state.enrollmentCounts.chipEnrollments,
        state.formData
      );
      expect(out).toEqual({ contents: ["Not Available"] });
    });
  });
});
