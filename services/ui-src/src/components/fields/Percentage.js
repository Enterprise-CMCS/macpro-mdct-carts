import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { TextField } from "@cmsgov/design-system";
import { generateQuestionNumber } from "../utils/helperFunctions";

const Percentage = ({ onChange, question, ...props }) => {
  const [error, setError] = useState(false);

  const change = ({ target: { name, value: newValue } }) => {
    let value = newValue;

    let sign = "";
    if (/^(\+|-)/.test(value)) {
      // starts with a + or - sign; temporarily remove
      [sign] = value;

      value = value.substr(1);
    }

    const numericString = `${value}`;
    // This strips everything but numbers and decimals
    const stripped = numericString.replace(/[^0-9.]/g, "");

    //This regex allows for numbers with ONLY a single decimal
    const regexTest = /^\d*[0-9]?(|.\d*[0-9]?|,\d*[0-9])?$/;
    const isNumberOrDecimal = regexTest.test(stripped);

    if (!isNumberOrDecimal) {
      setError("Please enter only numbers and decimals");
    } else {
      setError(false);
    }
    onChange({ target: { name, value: `${sign}${stripped}` } });
  };

  let ref;
  useEffect(() => {
    if (ref) {
      /*
       * Wrap the inner input element with a div. That wrapper div will get
       * an :after pseudo-style. We can't apply it to the input element directly
       * because input elements can't have :before or :after pseudo-elements.
       * HTML is funky.
       */
      const wrapper = document.createElement("div");
      wrapper.setAttribute("class", "input-holder__percent");
      ref.parentNode.appendChild(wrapper);
      wrapper.appendChild(ref);
    }
  }, []);

  /*
   * The CMS design system uses refs in a weird way - they are supposed to be
   * functions instead of ref objects. 🤷🏼‍♂️
   */
  const setRef = (inputComponent) => {
    ref = inputComponent;
  };

  return (
    <TextField
      className="ds-c-input"
      errorMessage={error}
      inputRef={setRef}
      label={`${generateQuestionNumber(question.id)}${question.label}`}
      hint={question.hint}
      name={question.id}
      numeric
      onChange={change}
      value={question.answer.entry || ""}
      {...props}
    />
  );
};
Percentage.propTypes = {
  onChange: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
};

export { Percentage };
export default Percentage;
