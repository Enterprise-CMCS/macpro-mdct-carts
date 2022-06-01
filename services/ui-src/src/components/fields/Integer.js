import React, { useState } from "react";
import PropTypes from "prop-types";
import { TextField } from "@cmsgov/design-system";
import { useSelector } from "react-redux";
import { generateQuestionNumber } from "../Utils/helperFunctions";

const Integer = ({ onChange, question, prevYear, ...props }) => {
  const [error, setError] = useState(false);
  const [answer, setAnswer] = useState(question.answer.entry);
  const lastYearTotals = useSelector((state) => state.lastYearTotals);
  const prevYearNumber =
    lastYearTotals[question.id.substring(0, question.id.length - 2)];
  const change = ({ target: { name, value } }) => {
    const stripped = value.replace(/[^0-9]+/g, "");
    const parsed = parseFloat(stripped);

    if (!Number.isNaN(parsed)) {
      onChange({ target: { name, value: `${parsed}` } });
      setAnswer(parsed);
      setError(false);
    } else {
      onChange({ target: { name, value: `` } });
      setAnswer(parsed);
      setError("Please enter whole numbers only");
    }
  };

  if (prevYearNumber && question.id.indexOf("-a") > -1) {
    return (
      <TextField
        className="ds-c-input"
        errorMessage={error}
        label={`${generateQuestionNumber(question.id)} ${question.label}`}
        hint={question.hint}
        name={question.id}
        numeric
        onChange={change}
        value={prevYearNumber}
        {...props}
      />
    );
  }

  return (
    <TextField
      className="ds-c-input"
      errorMessage={error}
      label={`${generateQuestionNumber(question.id)}${question.label}`}
      hint={question.hint}
      name={question.id}
      numeric
      onChange={change}
      value={prevYear ? prevYear.value : answer || ""}
      {...props}
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
