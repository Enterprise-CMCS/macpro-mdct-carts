import React, { useState } from "react";
import { useSelector } from "react-redux";
import { TextField } from "@cmsgov/design-system";
//utils
import { generateQuestionNumber } from "../utils/helperFunctions";
import { lteMask } from "../../util/constants";
//types
import PropTypes from "prop-types";

const getPrevYearValue = (question, lastYearFormData) => {
  let prevYearValue;

  // Split and create array from id
  const splitID = question.id.split("-");

  // the subquestion id (a, b, c, etc)
  const questionId = splitID[5];

  // Custom handling for -03-c-05 and -03-c-06
  if (
    splitID[1] === "03" &&
    splitID[2] === "c" &&
    (splitID[3] === "05" || splitID[3] === "06") &&
    questionId === "a" &&
    parseInt(splitID[4]) > 2 &&
    parseInt(splitID[4]) < 10
  ) {
    // Set year to last year
    splitID[0] = parseInt(splitID[0]) - 1;
    splitID.pop();

    const fieldsetId = splitID.join("-");
    const partIndex = parseInt(splitID[3]) - 1;

    // Get questions from last years JSON
    const questions =
      lastYearFormData?.[3]?.contents.section.subsections[2].parts[partIndex]
        .questions;

    // Filter down to this question
    const matchingQuestion = questions?.filter(
      (question) => fieldsetId === question?.fieldset_info?.id
    );

    // The first will always be correct
    if (matchingQuestion?.[0]) {
      prevYearValue = matchingQuestion[0].questions[0].answer?.entry;
    }
  }
  return prevYearValue;
};

const Integer = ({
  className,
  "data-testid": dataTestId,
  disabled = false,
  hint,
  id,
  inputMode,
  label,
  mask,
  name,
  onBlur,
  onChange,
  onClick,
  question,
  prevYear,
  printView,
  value,
  ...props
}) => {
  const [error, setError] = useState(false);
  const [answer, setAnswer] = useState(question.answer.entry);
  const lastYearFormData = useSelector((state) => state.lastYearFormData);

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

  const isLessThanElevenMask = (value) => {
    return printView && question.mask === lteMask && value <= 10 && value > 0;
  };

  const renderAnswer = () => {
    if (answer === null) {
      const value =
        getPrevYearValue(question, lastYearFormData) ?? prevYear?.value;
      if (isLessThanElevenMask(value)) return "<11";
      return value;
    } else {
      if (isLessThanElevenMask(answer)) return "<11";
      return answer || Number.isInteger(answer) ? answer : "";
    }
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
      id={id || question.id}
      hint={hint}
      inputMode={inputMode}
      label={label ?? questionLabel}
      mask={mask}
      name={name || question.id}
      numeric
      onBlur={onBlur}
      onClick={onClick}
      onChange={change}
      value={value ?? renderAnswer() ?? ""}
      {...props}
    />
  );
};
Integer.propTypes = {
  className: PropTypes.string,
  "data-testid": PropTypes.string,
  disabled: PropTypes.bool,
  hint: PropTypes.string,
  id: PropTypes.string,
  inputMode: PropTypes.string,
  label: PropTypes.string,
  mask: PropTypes.string,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  prevYear: PropTypes.object,
  printView: PropTypes.bool,
  question: PropTypes.object.isRequired,
  value: PropTypes.string,
};
Integer.defaultProps = {
  disabled: false,
  printView: false,
};

export default Integer;
