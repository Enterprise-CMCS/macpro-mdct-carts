import jsonpath from "./jsonpath";

/* eslint-disable camelcase */

// For the identity case, just return the first target value.
const identity = ([value]) => value;

const round = (number, precision) => {
  if (Number.isNaN(number)) {
    return number;
  }

  if (+number === Number.parseInt(number, 10)) {
    return number;
  }

  const decimals = precision >= 0 ? precision : 2;

  // Exponent. Because Math.round always rounds off all decimals, preemptively
  // multiply by some number of tens to get the right precision.
  const exp = Math.pow(10, decimals); // eslint-disable-line no-restricted-properties
  // Disable the eslint rule above. Math.pow is restricted, but the
  // exponentiation operator (**) is not supported in IE.

  const value = Math.round(+number * exp);

  if (!Number.isNaN(value)) {
    // Rather than doing additional math to get the decimal precision, since
    // that's just another place we can create Wrong Math™, split the result
    // from above into individual characters and insert a decimal point in
    // the right place.
    const digits = `${value}`.split("");
    if (decimals > 0) {
      digits.splice(digits.length - decimals, 0, ".");
    }

    // If the first character is a decimal, then we're less than 1 percent
    // and we should prepend a 0. We want "0.1%", not ".1%".
    if (digits[0] === ".") {
      digits.unshift(0);
    }

    while (digits[digits.length - 1] === 0) {
      digits.pop();
    }

    // Now put it all back together.
    return +`${digits.join("")}`;
  }

  return NaN;
};

const percent = ([numerator, denominator], precision = 2) => {
  if (+denominator !== 0) {
    const division = round((100 * +numerator) / +denominator, precision);
    if (!Number.isNaN(division)) {
      return `${division}%`;
    }
  }

  // Denominator is NaN or 0, or the division operation results in NaN
  return NaN;
};

const rpn = (values, rpnString, precision) => {
  if (rpnString) {
    const operands = [];
    const operators = [];

    rpnString.split(" ").forEach((token) => {
      if (token === "@") {
        operands.push(+values.shift());
      } else if (!Number.isNaN(+token)) {
        operands.push(+token);
      } else {
        operators.push(token);
      }
    });

    if (operands.length === operators.length + 1) {
      let computed = +operands.shift();

      while (operands.length > 0) {
        const newOperand = +operands.shift();
        const operator = operators.shift();

        switch (operator) {
          case "+":
            computed += newOperand;
            break;

          case "-":
            computed -= newOperand;
            break;

          case "/":
            computed /= newOperand;
            break;

          case "*":
            computed *= newOperand;
            break;

          default:
            computed = NaN;
            break;
        }
      }

      return round(computed, precision);
    }
  }

  return NaN;
};

// Maaaaaaaath.
const sum = (values) => values.reduce((acc, value) => acc + +value, 0);

const lookupFMAP = (state, fy) => {
  if (state.allStatesData && state.stateUser) {
    const stateAbbr = state.stateUser.abbr;
    const stateData = state.allStatesData.filter(
      (st) => st.code === stateAbbr
    )[0];
    const fmap =
      stateData?.fmap_set.filter((year) => year.fiscal_year === +fy)[0]
        ?.enhanced_FMAP || NaN;

    return fmap;
  }
  return "";
};

const synthesizeValue = (value, state) => {
  if (value.contents) {
    return value;
  }

  if (value.targets) {
    const targets = value.targets.map((target) => {
      if (typeof target === "object" && target.lookupFmapFy) {
        return lookupFMAP(state, target.lookupFmapFy);
      }
      return jsonpath.query(state, target)[0];
    });

    if (value.actions) {
      // For now, per the documentation, we only handle a single action, but
      // we'll have to solve for the more complicated case too. But not yet.
      const action = value.actions[0];

      switch (action) {
        case "identity":
          return { contents: identity(targets) };
        case "percentage":
          return { contents: percent(targets, value.precision) };
        case "rpn":
          return { contents: rpn(targets, value.rpn, value.precision) };
        case "sum":
          return { contents: sum(targets) };

        default:
          return { contents: targets[0] };
      }
    }

    return {
      contents: targets[0],
    };
  }

  // We don't know how to handle this value, so return it unchanged.
  return value;
};

export default synthesizeValue;
