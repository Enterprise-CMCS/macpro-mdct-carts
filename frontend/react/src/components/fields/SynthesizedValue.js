import React from 'react';
import { connect } from 'react-redux';
import jsonpath from '../../util/jsonpath';

import { Text } from './Text';

const SynthesizedValue = ({ question, value, ...props }) => {
  const clonedQuestion = JSON.parse(JSON.stringify(question));
  clonedQuestion.answer = { entry: value };
  return <Text question={clonedQuestion} {...props} disabled />
};

const mapStateToProps = (state, { question: { fieldset_info: { actions, targets }}}) => {
  const targetAnswers = targets.map(target => jsonpath.query(state, target)[0])

  // Currently only support a single action
  const action = actions[0];

  const synthesize = () => {
    switch(action.toLowerCase()) {
      case "identity":
        return targetAnswers;
      case "percentage":
        const [numerator, denominator] = targetAnswers;
        if(+numerator >= 0 && +denominator >= 0) {
          return +numerator / +denominator;
        }
        return 0;
      case "sum":
        return targetAnswers.map(n => +n || 0).reduce((s, v) => s + v, 0);
      default:
        return targetAnswers;
    }
  };

  return {
    value: synthesize()
  };
}

const ConnectedSynthesizedValue = connect(mapStateToProps)(SynthesizedValue);

export { 
  ConnectedSynthesizedValue as SynthesizedValue
};