import React, { useState } from "react";
import PropTypes from "prop-types";
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
      <div>
        {question.questions.map((q, i) => (
          <Question key={q.id || i} question={q} />
        ))}
      </div>
    );
  }

  const radioButttonList = question.answer.options.map(({ label, value }) => (
    <div className="radio-container" key={props.name + "-" + value}>
      <input
        key={value}
        checked={checked === value}
        type="radio"
        value={value}
        {...childProps}
        {...props}
        onChange={onCheck}
        onClick={unCheck}
        aria-label={`Question: ${
          question.label
        }, Answer: ${label} Radio Button with a status of ${
          checked === value ? "Checked" : "unchecked"
        }`}
        id={props.name + "-" + value}
      />
      <label className="label-radio" htmlFor={props.name + "-" + value}>
        {label}
      </label>
    </div>
  ));

  return <fieldset className="ds-c-fieldset">{radioButttonList}</fieldset>;
};
Radio.propTypes = {
  onChange: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
  name: PropTypes.string,
  onClick: PropTypes.func,
};

export { Radio };
export default Radio;
