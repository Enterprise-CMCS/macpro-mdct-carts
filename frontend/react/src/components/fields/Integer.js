import React, { useState } from "react";
import PropTypes from "prop-types";
import { TextField } from "@cmsgov/design-system-core";

const Integer = ({ onChange, question, ...props }) => {
  const [error, setError] = useState(false);

  const change = ({ target: { name, value } }) => {
    const stripped = value.replace(/,/g, "");
    const parsed = parseFloat(stripped);

    if (!Number.isNaN(parsed)) {
      onChange({ target: { name, value: `${stripped}` } });
      setError(false);
    } else {
      setError("Please enter whole numbers only");
    }
  };

  return (
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
  );
};
Integer.propTypes = {
  onChange: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
};

export { Integer };
export default Integer;
