import React, { useState } from "react";
import PropTypes from "prop-types";
import { TextField } from "@cmsgov/design-system-core";

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

    const numeric = +value;

    if (!Number.isNaN(numeric)) {
      onChange({ target: { name, value: `${sign}${value}` } });
      setError(false);
    } else {
      setError("Please enter only numbers and decimals");
    }
  };

  return (
    <>
      <TextField
        className="ds-c-input"
        errorMessage={error}
        label=""
        name={question.id}
        numeric
        onChange={change}
        value={question.answer.entry || ""}
        {...props}
      />
      %
    </>
  );
};
Percentage.propTypes = {
  onChange: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
};

export { Percentage };
export default Percentage;
