import React from "react";
import { connect } from "react-redux";
import { synthesizeValue } from "../../util/synthesize";

import { Text } from "./Text";

const SynthesizedValue = ({ question, value, ...props }) => {
  const clonedQuestion = JSON.parse(JSON.stringify(question));
  clonedQuestion.answer = { entry: value };
  return <Text question={clonedQuestion} {...props} disabled />;
};

const mapStateToProps = (state, { question: { fieldset_info } }) => {
  return {
    value: synthesizeValue(fieldset_info, state).contents,
  };
};

const ConnectedSynthesizedValue = connect(mapStateToProps)(SynthesizedValue);

export { ConnectedSynthesizedValue as SynthesizedValue };
