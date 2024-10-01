import React from "react";
import { useSelector, shallowEqual } from "react-redux";
//components
import Question from "./Question";
//utils
import synthesizeValue from "../../util/synthesize";
import { lteMask } from "../../util/constants";
//types
import PropTypes from "prop-types";

const SynthesizedValue = ({ question, printView, ...props }) => {
  const { value, showValue } = useSelector(
    (state) => getValue(state, question, printView),
    shallowEqual
  );

  return (
    showValue && (
      <div>
        <strong>Computed:</strong> {value}
        {question.questions &&
          question.questions.map((q) => (
            <Question key={q.id} question={q} {...props} />
          ))}
      </div>
    )
  );
};
SynthesizedValue.propTypes = {
  question: PropTypes.object.isRequired,
};

const getValue = (state, question, printView) => {
  const { allStatesData, formData } = state;
  const stateName = state.global.stateName;
  const stateUserAbbr = state.stateUser.abbr;
  const chipEnrollments = state.enrollmentCounts.chipEnrollments;
  const value = synthesizeValue(
    question.fieldset_info,
    allStatesData,
    stateName,
    stateUserAbbr,
    chipEnrollments,
    formData
  ).contents;
  const showValue = !(printView && question.fieldset_info.mask === lteMask);
  return { value, showValue };
};

export default SynthesizedValue;
