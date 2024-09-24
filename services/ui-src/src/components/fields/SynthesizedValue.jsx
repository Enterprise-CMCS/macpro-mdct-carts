import React from "react";
import { useSelector, shallowEqual } from "react-redux";
//components
import Question from "./Question";
//utils
import synthesizeValue from "../../util/synthesize";
//types
import PropTypes from "prop-types";

const SynthesizedValue = ({ question, printView, ...props }) => {
  const [allStatesData, stateName, stateUserAbbr, chipEnrollments, formData] =
    useSelector(
      (state) => [
        state.allStatesData,
        state.global.stateName,
        state.stateUser.abbr,
        state.enrollmentCounts.chipEnrollments,
        state.formData,
      ],
      shallowEqual
    );

  const showValue = !(
    printView && question.fieldset_info.mask === "lessThanEleven"
  );

  const renderValue = () => {
    return synthesizeValue(
      question.fieldset_info,
      allStatesData,
      stateName,
      stateUserAbbr,
      chipEnrollments,
      formData
    ).contents;
  };

  return (
    showValue && (
      <div>
        <strong>Computed:</strong> {renderValue()}
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
