import React, { useState } from "react";
import { TextField } from "@cmsgov/design-system-core";

const Integer = ({ onChange, question, ...props }) => {
  const [error, setError] = useState(false);

  const change = ({ target: { name, value } }) => {
    const numeric = +value;
    const parsed = parseInt(numeric, 10);

    if (numeric === parsed && !isNaN(parsed)) {
      onChange({ target: { name, value } });
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

export { Integer };
