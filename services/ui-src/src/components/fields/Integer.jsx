import React, { useState } from "react";
import { useSelector } from "react-redux";
import { TextField } from "@cmsgov/design-system";
//utils
import { generateQuestionNumber } from "../utils/helperFunctions";
import { Mask } from "util/constants";
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

const Integer = ({ onChange, question, prevYear, printView, ...props }) => {
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
    return (
      printView &&
      question.mask === Mask.lessThanEleven &&
      value <= 10 &&
      value > 0
    );
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
  return (
    <TextField
      className="ds-c-input"
      errorMessage={error}
      label={`${generateQuestionNumber(question.id)}${question.label}`}
      hint={question.hint}
      name={question.id}
      numeric
      onChange={change}
      value={renderAnswer()}
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

export default Integer;
