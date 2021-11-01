import React, { useState } from "react";
import PropTypes from "prop-types";
import { Choice } from "@cmsgov/design-system-core";

import Question from "./Question";

const Radio = ({ onChange, onClick, question, ...props }) => {
  const [checked, setChecked] = useState(question.answer.entry);
  const onCheck = (e) => {
    setChecked(e.target.value);
    onChange(e);
  };

  const unCheck = (e) => {
    setChecked("");
    onClick(e);
  };

  const childProps = {};

  if (question.questions && question.questions.length) {
    childProps.checkedChildren = (
      <div className="ds-c-choice__checkedChild">
        {question.questions.map((q, i) => (
          <Question key={q.id || i} question={q} />
        ))}
      </div>
    );
  }

  return question.answer.options.map(({ label, value }) => (
    <Choice
      key={value}
      checked={checked === value}
      type="radio"
      value={value}
      {...childProps}
      {...props}
      onChange={onCheck}
      onClick={unCheck}
    >
      {label}
    </Choice>
  ));
};
Radio.propTypes = {
  onChange: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
};

export { Radio };
export default Radio;
