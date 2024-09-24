import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
//components
import Question from "./Question";
//utils
import synthesizeValue from "../../util/synthesize";
//types
import PropTypes from "prop-types";

const SynthesizedValue = ({ question, ...props }) => {
  const [displayValue, setDisplayValue] = useState();
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

  useEffect(() => {
    setDisplayValue(
      synthesizeValue(
        question.fieldset_info,
        allStatesData,
        stateName,
        stateUserAbbr,
        chipEnrollments,
        formData
      ).contents
    );
  }, [allStatesData, stateName, stateUserAbbr, chipEnrollments, formData]);

  return (
    <div>
      <strong>Computed:</strong> {displayValue}
      {question.questions &&
        question.questions.map((q) => (
          <Question key={q.id} question={q} {...props} />
        ))}
    </div>
  );
};
SynthesizedValue.propTypes = {
  question: PropTypes.object.isRequired,
};

export default SynthesizedValue;
