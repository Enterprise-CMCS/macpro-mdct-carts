import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Question from "./Question";
import synthesizeValue from "../../util/synthesize";

const SynthesizedValue = ({ question, value, ...props }) => {
  return (
    <div>
      <strong>Computed:</strong> {value}
      {question.questions &&
        question.questions.map((q) => (
          <Question key={q.id} question={q} {...props} />
        ))}
    </div>
  );
};
SynthesizedValue.propTypes = {
  question: PropTypes.object.isRequired,
  value: PropTypes.oneOf([PropTypes.number, PropTypes.string]).isRequired,
};

const mapStateToProps = (state, { question: { fieldset_info: fsInfo } }) => {
  return {
    value: synthesizeValue(fsInfo, state).contents,
  };
};

const ConnectedSynthesizedValue = connect(mapStateToProps)(SynthesizedValue);

export { ConnectedSynthesizedValue as SynthesizedValue };

export default ConnectedSynthesizedValue;
