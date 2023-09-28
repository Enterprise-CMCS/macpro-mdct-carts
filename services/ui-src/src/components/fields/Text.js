import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { TextField } from "@cmsgov/design-system";
import { connect } from "react-redux";
import { generateQuestionNumber } from "../utils/helperFunctions";

const Text = ({ question, state, lastYearFormData, ...props }) => {
  const [prevYearValue, setPrevYearValue] = useState();

  const getPrevYearValue = async () => {
    // Create array from id
    const splitID = question.id.split("-");

    // Even years get inputs, odd years get previous year data
    const shouldGetPriorYear = splitID[0] % 2;

    // If question is Part 6, section 3c, question 9
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
          id={question.id}
          value={
            (question.answer && question.answer.entry) || prevYearValue || ""
          }
          type="text"
          {...props}
          disabled={!!props.disabled}
        />
      </div>
      <p className="print-text-area">
        {(question.answer && question.answer.entry) || prevYearValue || ""}
      </p>
    </>
  );
};
Text.propTypes = {
  question: PropTypes.object.isRequired,
  state: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  year: PropTypes.number.isRequired,
  lastYearFormData: PropTypes.object.isRequired,
};

const mapState = (state) => ({
  state: state.formData[0].contents?.section?.state,
  year: state.formData[0].contents.section.year,
  lastYearFormData: state.lastYearFormData,
  lastYearTotals: state.lastYearTotals,
});

export default connect(mapState)(Text);
