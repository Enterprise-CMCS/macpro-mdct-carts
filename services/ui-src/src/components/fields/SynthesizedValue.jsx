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
  const value = useSelector((state) => {
    const allStatesData = state.allStatesData;
    const stateName = state.global.stateName;
    const stateUserAbbr = state.stateUser.abbr;
    const chipEnrollments = state.enrollmentCounts.chipEnrollments;
    const formData = state.formData;
    return synthesizeValue(
      question.fieldset_info,
      allStatesData,
      stateName,
      stateUserAbbr,
      chipEnrollments,
      formData
    ).contents;
  }, shallowEqual);

  const showValue = !(printView && question.fieldset_info.mask === lteMask);

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

export default SynthesizedValue;
