import React, { useState } from "react";
import PropTypes from "prop-types";
import { TextField } from "@cmsgov/design-system";
import { useSelector } from "react-redux";
import { generateQuestionNumber } from "../utils/helperFunctions";

const Integer = ({ onChange, question, prevYear, printView, ...props }) => {
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
  const renderAnswer = (val) => {
    if (val || Number.isInteger(val)) {
      if (printView && val <= 10 && val > 0) {
        return "<11";
      }
      return val;
    }
    return "";
  };

  (val) => (val || Number.isInteger(val) ? val : ""); // may attempt to rerender string on page load, so both val || isInteger
  return (
    <TextField
      className="ds-c-input"
      errorMessage={error}
      label={`${generateQuestionNumber(question.id)}${question.label}`}
      hint={question.hint}
      name={question.id}
      numeric
      onChange={change}
      value={answer != null ? renderAnswer(answer) : prevYear && prevYear.value}
      {...props}
    />
  );
};
Integer.propTypes = {
  onChange: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
  prevYear: PropTypes.object,
  printView: PropTypes.bool,
};

export { Integer };
export default Integer;
