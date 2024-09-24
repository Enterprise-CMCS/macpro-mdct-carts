import { evaluate } from "mathjs";
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

  /*
   * Exponent. Because Math.round always rounds off all decimals, preemptively
   * multiply by some number of tens to get the right precision.
   */
  const exp = Math.pow(10, decimals); // eslint-disable-line no-restricted-properties
  /*
   * Disable the eslint rule above. Math.pow is restricted, but the
   * exponentiation operator (**) is not supported in IE.
   */

  const value = Math.round(+number * exp);

  if (!Number.isNaN(value)) {
    /*
     * Rather than doing additional math to get the decimal precision, since
     * that's just another place we can create Wrong Math™, split the result
     * from above into individual characters and insert a decimal point in
     * the right place.
     */
    const digits = `${value}`.split("");
    if (decimals > 0) {
      digits.splice(digits.length - decimals, 0, ".");
    }

    /*
     * If the first character is a decimal, then we're less than 1 percent
     * and we should prepend a 0. We want "0.1%", not ".1%".
     */
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
  if (+denominator !== 0 && numerator !== "" && numerator !== null) {
    const division = round((100 * +numerator) / +denominator, precision);
    if (!Number.isNaN(division)) {
      return `${division}%`;
    }
  }

  // Denominator is NaN or 0, or the division operation results in ""
  return "";
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

  return "";
};

/**
 * Calculate formulas from JSON using human-readable algorithms.
 *
 * @param {array} targets
 * @param {string} formula
 * @param {int} precision
 * @returns {string}
 */
const formula = (targets, providedFormula, precision) => {
  let computedValue = "Not Available";
  let available = true;
  let manipulatedFormula = providedFormula;

  if (manipulatedFormula && targets) {
    // Loop through formula as an object
    Object.keys(manipulatedFormula).forEach((i) => {
      // Data in Database can get added commas which will break when used in formulas so we get rid of the commas
      if (typeof targets[i] == "string") {
        targets[i] = targets[i].replace(/,/g, "");
        //Checks for alphabet characters and invalidates those values
        if (!/^[0-9,.]*$/.test(targets[i])) {
          targets[i] = "0";
        }
      }
      // Check if value has a string value
      if (!Number.isNaN(targets[i]) && targets[i] !== "") {
        const replaceValue = new RegExp(`<${i}>`, "g");

        // Replace placehholders with actual values from targets
        manipulatedFormula = manipulatedFormula.replace(
          replaceValue,
          Number.isNaN(targets[i]) || targets[i] === null || targets[i] === ""
            ? 0
            : targets[i]
        );
      } else {
        // If value is a non-empty string, return false
        available = false;
      }
    });

    if (available) {
      // Evaluate the formula (string) and round to precision
      computedValue = round(evaluate(manipulatedFormula), precision);
    }
  }

  return computedValue !== 0 ? computedValue : "";
};

// If all of the values in the calculation are null or blank, then don't display 0 as the total
const sum = (values) => {
  let returnValue = "";
  const hasNumbers = values.some((value) => value !== null && value !== "");
  if (hasNumbers) {
    returnValue = values.reduce((acc, value) => acc + +value, 0);
  }
  return returnValue;
};

const lookupFMAP = (allStatesData, stateName, stateUserAbbr, fy) => {
  // if admin and in a print view get state param
  const urlSearchParams = new URLSearchParams(window.location.search);
  const stateFromParams = urlSearchParams.get("state");

  if (allStatesData && (stateName || stateUserAbbr || stateFromParams)) {
    let stateData = "";
    if (stateUserAbbr) {
      stateData = allStatesData.filter((st) => st.code === stateUserAbbr)[0];
    } else if (stateFromParams) {
      stateData = allStatesData.filter(
        (st) => st.code.toLowerCase() === stateFromParams.toLowerCase()
      )[0];
    } else {
      stateData = allStatesData.filter((st) => st.name === stateName)[0];
    }
    const fmap =
      stateData?.fmapSet.filter((year) => year.fiscalYear === +fy)[0]
        ?.enhancedFmap || NaN;

    return fmap;
  }
  return "";
};

const snakeToCamel = (str) =>
  str
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace("-", "").replace("_", "")
    );

// returns the state abbreviation for the associated report
const getStateAbbr = (stateUserAbbr) => {
  if (stateUserAbbr) return stateUserAbbr;
  const windowPathName = window.location.pathname;
  // if admin, grab the state from the URL
  const stateFromURL = windowPathName.split("/")[3];

  // if admin and in a print view get state param
  const urlSearchParams = new URLSearchParams(window.location.search);
  const stateFromParams = urlSearchParams.get("state");

  return windowPathName.includes("print") ? stateFromParams : stateFromURL;
};

/**
 * Retrieve acsSet from state and return for individual state.
 *
 * @param {string} state
 * @param {string} ffy
 * @param {string} acsProperty
 * @returns {string}
 */
const lookupAcs = (allStatesData, stateUserAbbr, { ffy, acsProperty }) => {
  let returnValue = "Not Available";
  // Support prior lookup syntax in form lookups
  const acsPropQuery = acsProperty.includes("_")
    ? snakeToCamel(acsProperty)
    : acsProperty;

  // if allStatesData is a populated array
  if (allStatesData?.length > 0) {
    const stateAbbr = getStateAbbr(stateUserAbbr);

    // Find data for matching state
    const stateData = allStatesData.find((st) => st.code === stateAbbr);
    const acs = stateData?.acsSet.find((year) => year.year === +ffy);

    // If acs exists, return the value from the object
    if (acs) {
      returnValue = Number(`${acs[acsPropQuery]}`).toLocaleString();
      if (acsProperty.includes("percent")) {
        returnValue += "%";
      }
    }
  }
  return returnValue;
};

/**
 * Retrieve acsSet from state and return percentage change for 2 given years.
 *
 * @param {object} allStatesData
 * @param {string} stateUserAbbr
 * @param {string} ffy1
 * @param {string} ffy2
 * @param {string} acsProperty
 * @returns {(string|float)}
 */
export const compareACS = (
  allStatesData,
  stateUserAbbr,
  { ffy1, ffy2, acsProperty }
) => {
  const percentagePrecision = 2;
  let returnValue = "Not Available";
  // if allStatesData is a populated array
  if (allStatesData?.length > 0) {
    const stateAbbr = getStateAbbr(stateUserAbbr);
    const stateData = allStatesData.find((st) => st.code === stateAbbr);

    // Find the correct year of state data
    const startACS = stateData?.acsSet.find(
      (year) => year.year === parseInt(ffy1, 10)
    );
    const endACS = stateData?.acsSet.find(
      (year) => year.year === parseInt(ffy2, 10)
    );

    // If start year and end year of ACS exist, return the calculated value (percent change) from the objects
    if (startACS && endACS) {
      // Convert the selected column to a float
      const tempStart = parseFloat(startACS[acsProperty]);
      const tempEnd = parseFloat(endACS[acsProperty]);

      // Calculate the percent change

      returnValue = // eslint-disable-next-line
        parseFloat(((tempEnd - tempStart) / tempStart) * 100)
          .toFixed(percentagePrecision)
          .toLocaleString() + "%";
    }
  }
  return returnValue;
};

export const lookupChipEnrollments = (
  chipEnrollments,
  { ffy, enrollmentType, index }
) => {
  let returnValue = "Not Available";
  if (chipEnrollments && chipEnrollments.length > 0) {
    let targetValue = chipEnrollments.find(
      (enrollment) =>
        enrollment.yearToModify == ffy &&
        enrollment.indexToUpdate === index &&
        enrollment.typeOfEnrollment === enrollmentType
    );
    // Lookup the primary stat for the past year if missing
    if (!targetValue && index == 1) {
      targetValue = chipEnrollments.find(
        (enrollment) =>
          enrollment.yearToModify == ffy - 1 &&
          enrollment.indexToUpdate === index + 1 &&
          enrollment.typeOfEnrollment === enrollmentType
      );
    }
    if (targetValue) {
      returnValue = targetValue.enrollmentCount.toLocaleString();
    }
  }
  return returnValue;
};

export const compareChipEnrollements = (
  chipEnrollments,
  { ffy, enrollmentType }
) => {
  let returnValue = "Not Available";
  if (chipEnrollments && chipEnrollments.length > 0) {
    // Retrieve Values
    let oldCount = chipEnrollments.find(
      (enrollment) =>
        enrollment.yearToModify == ffy &&
        enrollment.indexToUpdate === 1 &&
        enrollment.typeOfEnrollment === enrollmentType
    );
    const newCount = chipEnrollments.find(
      (enrollment) =>
        enrollment.yearToModify == ffy &&
        enrollment.indexToUpdate === 2 &&
        enrollment.typeOfEnrollment === enrollmentType
    );
    if (newCount && !oldCount) {
      /*
       * In case this year's data has been sent, but last year's wasn't included
       * we still can look it up as the last year's current value
       */
      oldCount = chipEnrollments.find(
        (enrollment) =>
          enrollment.yearToModify == ffy - 1 &&
          enrollment.indexToUpdate === 2 &&
          enrollment.typeOfEnrollment === enrollmentType
      );
    }

    // Calculate
    if (oldCount && newCount) {
      if (oldCount.enrollmentCount === 0) return "-"; // Don't divide by 0
      returnValue =
        ((newCount.enrollmentCount - oldCount.enrollmentCount) /
          oldCount.enrollmentCount) *
        100;
      returnValue =
        (Math.round(returnValue * 1000) / 1000).toLocaleString() + "%";
    }
  }
  return returnValue;
};

const synthesizeValue = (
  value,
  allStatesData,
  stateName,
  stateUserAbbr,
  chipEnrollments,
  formData
) => {
  if (value.contents) {
    return value;
  }

  if (value.lookupFmapFy) {
    return {
      contents: lookupFMAP(
        allStatesData,
        stateName,
        stateUserAbbr,
        value.lookupFmapFy
      ),
    };
  }

  if (value.lookupAcs) {
    return {
      contents: [lookupAcs(allStatesData, stateUserAbbr, value.lookupAcs)],
    };
  }

  if (value.compareACS) {
    return {
      contents: [compareACS(allStatesData, stateUserAbbr, value.compareACS)],
    };
  }

  if (value.lookupChipEnrollments) {
    return {
      contents: [
        lookupChipEnrollments(chipEnrollments, value.lookupChipEnrollments),
      ],
    };
  }

  if (value.compareChipEnrollements) {
    return {
      contents: [
        compareChipEnrollements(chipEnrollments, value.compareChipEnrollements),
      ],
    };
  }

  if (value.targets) {
    if (value.mask) {
      return value.mask;
    }
    const targets = value.targets.map((target) => {
      if (typeof target === "object" && target.lookupFmapFy) {
        return lookupFMAP(
          allStatesData,
          stateName,
          stateUserAbbr,
          target.lookupFmapFy
        );
      }
      return jsonpath.query(formData, target)[0];
    });

    if (value.actions) {
      /*
       * For now, per the documentation, we only handle a single action, but
       * we'll have to solve for the more complicated case too. But not yet.
       */
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
        case "formula":
          return { contents: formula(targets, value.formula, value.precision) };

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
