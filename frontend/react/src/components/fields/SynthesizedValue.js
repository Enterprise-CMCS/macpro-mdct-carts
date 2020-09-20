import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Text } from "./Text";
import { synthesizeValue } from "../../util/synthesize";

const SynthesizedValue = ({ question, value, ...props }) => {
  const clonedQuestion = JSON.parse(JSON.stringify(question));
  clonedQuestion.answer = { entry: value };
  return <Text question={clonedQuestion} {...props} disabled />;
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
