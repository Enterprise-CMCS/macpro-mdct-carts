import synthesize from "./synthesize";

const state = {
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
  ],
};

describe("value synthesization utility", () => {
  describe("handles identity", () => {
    test("with no values", () => {
      // Returns undefined, because there's not a value
      const out = synthesize(
        {
          targets: [],
          actions: ["identity"],
        },
        state
      );
      expect(out).toEqual({ contents: undefined });
    });

    test("with multiple values", () => {
      // Returns the first value
      const out = synthesize(
        {
          targets: [
            "$..*[?(@.id==='item3')].answer.entry",
            "$..*[?(@.id==='item4')].answer.entry",
          ],
          actions: ["identity"],
        },
        state
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
            "$..*[?(@.id==='item1')].answer.entry",
            "$..*[?(@.id==='item3')].answer.entry",
            "$..*[?(@.id==='item7')].answer.entry",
          ],
          actions: ["sum"],
        },
        state
      );
      expect(out).toEqual({ contents: NaN });
    });

    test("with a value that doesn't exist", () => {
      // Undefined is undefined, so the math is NaN
      const out = synthesize(
        {
          targets: [
            "$..*[?(@.id==='item1')].answer.entry",
            "$..*[?(@.id==='item3')].answer.entry",
            "$..*[?(@.id==='item8')].answer.entry",
          ],
          actions: ["sum"],
        },
        state
      );
      expect(out).toEqual({ contents: NaN });
    });

    test("with a null value", () => {
      // Null gets coalesced to zero, so the sum should work
      const out = synthesize(
        {
          targets: [
            "$..*[?(@.id==='item1')].answer.entry",
            "$..*[?(@.id==='item3')].answer.entry",
            "$..*[?(@.id==='item6')].answer.entry",
          ],
          actions: ["sum"],
        },
        state
      );
      expect(out).toEqual({ contents: 4 });
    });

    test("with multiple valid values", () => {
      // Adds 'em up
      const out = synthesize(
        {
          targets: [
            "$..*[?(@.id==='item1')].answer.entry",
            "$..*[?(@.id==='item3')].answer.entry",
            "$..*[?(@.id==='item5')].answer.entry",
          ],
          actions: ["sum"],
        },
        state
      );
      expect(out).toEqual({ contents: 9 });
    });
  });

  describe("handles percentages", () => {
    it("with only one value", () => {
      // No denominator, no percenator
      const out = synthesize(
        {
          targets: ["$..*[?(@.id==='item4')].answer.entry"],
          actions: ["percentage"],
        },
        state
      );
      expect(out).toEqual({ contents: NaN });
    });

    it("with a zero denominator", () => {
      // Zero denominator, no percenator
      const out = synthesize(
        {
          targets: [
            "$..*[?(@.id==='item4')].answer.entry",
            "$..*[?(@.id==='item0')].answer.entry",
          ],
          actions: ["percentage"],
        },
        state
      );
      expect(out).toEqual({ contents: NaN });
    });

    it("with a valid division, no set precision", () => {
      // Defaults to two decimal point precision
      const out = synthesize(
        {
          targets: [
            "$..*[?(@.id==='item1')].answer.entry",
            "$..*[?(@.id==='item3')].answer.entry",
          ],
          actions: ["percentage"],
        },
        state
      );
      expect(out).toEqual({ contents: "33.33%" });
    });

    it("with a valid division, 4-decimal precision", () => {
      // Uses configured precision
      const out = synthesize(
        {
          targets: [
            "$..*[?(@.id==='item1')].answer.entry",
            "$..*[?(@.id==='item3')].answer.entry",
          ],
          actions: ["percentage"],
          precision: 4,
        },
        state
      );
      expect(out).toEqual({ contents: "33.3333%" });
    });

    it("with a valid division, no decimals", () => {
      // Uses configured precision
      const out = synthesize(
        {
          targets: [
            "$..*[?(@.id==='item1')].answer.entry",
            "$..*[?(@.id==='item3')].answer.entry",
          ],
          actions: ["percentage"],
          precision: 0,
        },
        state
      );
      expect(out).toEqual({ contents: "33%" });
    });

    it("with a valid division, negative precision", () => {
      // Uses the default for invalid precisions
      const out = synthesize(
        {
          targets: [
            "$..*[?(@.id==='item1')].answer.entry",
            "$..*[?(@.id==='item3')].answer.entry",
          ],
          actions: ["percentage"],
          precision: -3,
        },
        state
      );
      expect(out).toEqual({ contents: "33.33%" });
    });
  });

  describe("handles RPNs", () => {
    it("with too few operands", () => {
      // NaN, because there's an operator with nothing to operate on. This
      // assumes that all of our operators are binary, not unary.
      const out = synthesize(
        {
          targets: [
            "$..*[?(@.id==='item1')].answer.entry",
            "$..*[?(@.id==='item3')].answer.entry",
          ],
          actions: ["rpn"],
          rpn: "@ @ + + -",
        },
        state
      );

      expect(out).toEqual({ contents: NaN });
    });

    it("with extra operands", () => {
      // The extra ones get ignored.
      const out = synthesize(
        {
          targets: [
            "$..*[?(@.id==='item1')].answer.entry",
            "$..*[?(@.id==='item3')].answer.entry",
            "$..*[?(@.id==='item1')].answer.entry",
            "$..*[?(@.id==='item3')].answer.entry",
          ],
          actions: ["rpn"],
          rpn: "@ @ +",
        },
        state
      );

      expect(out).toEqual({ contents: 4 });
    });

    it("with any value NaN", () => {
      // There are too many @ tokens, so the last one resolves to NaN. Now the
      // whole result should be NaN as well.
      const out = synthesize(
        {
          targets: [
            "$..*[?(@.id==='item1')].answer.entry",
            "$..*[?(@.id==='item2')].answer.entry",
            "$..*[?(@.id==='item3')].answer.entry",
            "$..*[?(@.id==='item4')].answer.entry",
          ],
          actions: ["rpn"],
          rpn: "@ @ @ @ @ - + * /",
        },
        state
      );

      expect(out).toEqual({ contents: NaN });
    });

    it("with addition, subtraction, division, and multiplication", () => {
      // Does it right!
      const out = synthesize(
        {
          targets: [
            "$..*[?(@.id==='item1')].answer.entry",
            "$..*[?(@.id==='item2')].answer.entry",
            "$..*[?(@.id==='item3')].answer.entry",
            "$..*[?(@.id==='item4')].answer.entry",
            "$..*[?(@.id==='item5')].answer.entry",
          ],
          actions: ["rpn"],
          rpn: "@ @ @ @ @ - + * /",
        },
        state
      );

      expect(out).toEqual({ contents: 1.6 });
    });

    it("with constants", () => {
      // Does it right!
      const out = synthesize(
        {
          targets: [
            "$..*[?(@.id==='item1')].answer.entry",
            "$..*[?(@.id==='item2')].answer.entry",
            "$..*[?(@.id==='item3')].answer.entry",
          ],
          actions: ["rpn"],
          rpn: "@ @ @ 2 + + *",
        },
        state
      );

      expect(out).toEqual({ contents: 12 });
    });

    it("with not-actually a postfix notation because...", () => {
      // The operands and operators are parsed from the RPN string separately
      // and then applied in their respective orders. As a result, it doesn't
      // matter what order they are with respect to each other, as long as
      // operands and operators are ordered amongst themselves.
      const out = synthesize(
        {
          targets: [
            "$..*[?(@.id==='item1')].answer.entry",
            "$..*[?(@.id==='item2')].answer.entry",
            "$..*[?(@.id==='item3')].answer.entry",
            "$..*[?(@.id==='item4')].answer.entry",
            "$..*[?(@.id==='item5')].answer.entry",
          ],
          actions: ["rpn"],
          rpn: "- + @ @ * / @ @ @",
        },
        state
      );

      expect(out).toEqual({ contents: 1.6 });
    });

    it("handles precision", () => {
      // Does it right!
      const out = synthesize(
        {
          targets: [
            "$..*[?(@.id==='item1')].answer.entry",
            "$..*[?(@.id==='item3')].answer.entry",
          ],
          actions: ["rpn"],
          rpn: "@ @ / 100 *",
          precision: 1,
        },
        state
      );

      expect(out).toEqual({ contents: 33.3 });
    });
  });
});
