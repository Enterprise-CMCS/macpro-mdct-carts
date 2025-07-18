import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
//components
import { TextField } from "@cmsgov/design-system";
//utils
import { generateQuestionNumber } from "../utils/helperFunctions";
// types
import PropTypes from "prop-types";

const Text = ({
  "data-testid": dataTestId,
  disabled = false,
  hint,
  id,
  label,
  multiline = false,
  name,
  onChange,
  onClick,
  question,
  rows,
  ...props
}) => {
  const [prevYearValue, setPrevYearValue] = useState();
  const [state, lastYearFormData] = useSelector(
    (state) => [
      state.formData[0].contents?.section?.state,
      state.lastYearFormData,
    ],
    shallowEqual
  );

  const getPrevYearValue = async () => {
    // Create array from id
    const splitID = question.id.split("-");

    // Even years get inputs, odd years get previous year data
    const shouldGetPriorYear = splitID[0] % 2;

    // If question is on an odd year form, section 3c, part 5 or 6, and question 9
    if (
      shouldGetPriorYear &&
      splitID[1] === "03" &&
      splitID[2] === "c" &&
      (splitID[3] === "05" || splitID[3] === "06") &&
      splitID[4] === "09"
    ) {
      // Set year to last year
      const lastYear = parseInt(splitID[0]) - 1;
      splitID[0] = lastYear;
      const fieldsetId = splitID.join("-");
      const partIndex = parseInt(splitID[3]) - 1;

      let value =
        getValueFromLastYear(lastYearFormData[3], fieldsetId, partIndex) || "";
      setPrevYearValue(value);
    }
  };

  const getValueFromLastYear = (data, fieldsetId, partIndex) => {
    let lastYearAnswer;
    // Get questions from last years JSON
    const questions =
      data.contents.section.subsections[2].parts[partIndex].questions;
    // Derive matching question
    let matchingQuestion = questions.filter(
      (question) => fieldsetId === question?.id
    );

    // Always use first item in array
    if (matchingQuestion[0]) {
      lastYearAnswer = matchingQuestion[0].answer.entry;
    }

    return lastYearAnswer ?? "";
  };

  useEffect(() => {
    getPrevYearValue().then();
  }, [state]);

  return (
    <>
      <label htmlFor={question.id}>{`${generateQuestionNumber(question.id)} ${
        question.label
      }`}</label>
      {question.hint && (
        <p aria-label={`${question.label} hint`} className="ds-c-field__hint">
          {question.hint}
        </p>
      )}
      <div className="non-print-textarea">
        <TextField
          aria-label={`${question.label}${
            question.hint ? ` ${question.hint}` : ""
          }`}
          data-testid={dataTestId}
          disabled={disabled}
          hint={hint}
          id={id || question.id}
          label={label ?? ""}
          multiline={multiline}
          name={name || question.id}
          onChange={onChange}
          onClick={onClick}
          rows={rows}
          type="text"
          value={question.answer?.entry ?? prevYearValue ?? ""}
          {...props}
        />
      </div>
      <p className="print-text-area">
        {question.answer?.entry ?? prevYearValue ?? ""}
      </p>
    </>
  );
};
Text.propTypes = {
  "data-testid": PropTypes.string,
  disabled: PropTypes.bool,
  hint: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  multiline: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  question: PropTypes.object.isRequired,
  rows: PropTypes.number,
};
Text.defaultProps = {
  disabled: false,
  multiline: false,
};
export default Text;
