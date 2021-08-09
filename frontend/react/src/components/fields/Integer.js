import React, { useState } from "react";
import PropTypes from "prop-types";
import { TextField } from "@cmsgov/design-system-core";

const Integer = ({ onChange, question, prevYear, ...props }) => {
  const [error, setError] = useState(false);
  const change = ({ target: { name, value } }) => {
    const stripped = value.replace(/[^0-9]+/g, "");
    const parsed = parseFloat(stripped);

    if (!Number.isNaN(parsed)) {
      onChange({ target: { name, value: `${parsed}` } });
      setError(false);
    } else {
      setError("Please enter whole numbers only");
    }
  };

  return (
    <TextField
      {...props}
      className="ds-c-input"
      errorMessage={error}
      label=""
      name={question.id}
      numeric
      onChange={change}
      value={(prevYear ? prevYear.value : question.answer.entry) || ""}
      disabled={prevYear ? prevYear.disabled : false}
    />
  );
};
Integer.propTypes = {
  onChange: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
  prevYear: PropTypes.object,
};

export { Integer };
export default Integer;
