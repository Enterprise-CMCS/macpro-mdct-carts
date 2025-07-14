import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { TextField } from "@cmsgov/design-system";
import { generateQuestionNumber } from "../utils/helperFunctions";

const Percentage = ({
  className,
  "data-testid": dataTestId,
  disabled = false,
  hint,
  id,
  label,
  name,
  onBlur,
  onChange,
  onClick,
  question,
  value,
  ...props
}) => {
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

  const questionLabel = generateQuestionNumber(question.id)
    ? `${generateQuestionNumber(question.id)}${question.label}`
    : question.label;

  return (
    <TextField
      className={className || "ds-c-input"}
      data-testid={dataTestId}
      disabled={disabled}
      errorMessage={error}
      hint={hint || question.hint}
      id={id || question.id}
      inputRef={setRef}
      label={label ?? questionLabel}
      name={name || question.id}
      numeric
      onBlur={onBlur}
      onChange={change}
      onClick={onClick}
      value={value ?? question.answer.entry ?? ""}
      {...props}
    />
  );
};
Percentage.propTypes = {
  className: PropTypes.string,
  "data-testid": PropTypes.string,
  disabled: PropTypes.bool,
  hint: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  question: PropTypes.object.isRequired,
  value: PropTypes.string,
};
Percentage.defaultProps = {
  disabled: false,
};

export { Percentage };
export default Percentage;
