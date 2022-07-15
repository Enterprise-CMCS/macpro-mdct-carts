import React from "react";
import PropTypes from "prop-types";

const Checkbox = ({ onChange, question, ...props }) => {
  const value = Array.isArray(question.answer.entry)
    ? question.answer.entry
    : [question.answer.entry];

  const change = ({ target: { name, value: newValue } }) => {
    const index = value.indexOf(newValue);
    if (index >= 0) {
      value.splice(index, 1);
      onChange({ target: { name, value } });
    } else {
      onChange({ target: { name, value: [...value, newValue] } });
    }
  };

  const radioButttonList = question.answer.options.map(
    ({ label, value: checkBoxValue }, idx) => {
      return (
        <div
          className="radio-container"
          key={props.name + "-" + value + "-" + idx}
        >
          <input
            aria-label={`Question: ${question.label}, Answer: ${label}`}
            id={`${props.name}-${value}`}
            key={value}
            type="checkbox"
            value={checkBoxValue}
            onChange={change}
            checked={value.indexOf(checkBoxValue) >= 0}
            name={props.name + value}
            {...props}
          />
          <label className="label-radio" htmlFor={`${props.name}-${value}`}>
            {label}
          </label>
        </div>
      );
    }
  );

  return <fieldset className="ds-c-fieldset">{radioButttonList}</fieldset>;
};
Checkbox.propTypes = {
  onChange: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
  name: PropTypes.string,
};

export { Checkbox };
export default Checkbox;
