import React, { useState } from "react";
import { TextField } from "@cmsgov/design-system-core";

const Percentage = ({ onChange, question, ...props }) => {
  const [error, setError] = useState(false);

  const change = ({ target: { name, value: newValue } }) => {
    let value = newValue;

    let sign = "";
    if (/^(\+|-)/.test(value)) {
      // starts with a + or - sign; temporarily remove
      sign = value[0];
      value = value.substr(1);
    }

    const numeric = +value;

    if (!isNaN(numeric)) {
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

export { Percentage };
