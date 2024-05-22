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
          key={props.name + "-" + checkBoxValue + "-" + idx}
        >
          <input
            {...props}
            aria-label={`Question: ${question.label}, Answer: ${label}`}
            id={`${props.name}-${checkBoxValue}`}
            key={checkBoxValue}
            type="checkbox"
            value={checkBoxValue}
            onChange={change}
            checked={value.indexOf(checkBoxValue) >= 0}
            name={props.name}
          />
          <label className="label-radio" htmlFor={`${props.name}-${checkBoxValue}`}>
            {label}
          </label>
        </div>
      );
    }
  );

  return <div className="ds-c-fieldset">{radioButttonList}</div>;
};
Checkbox.propTypes = {
  onChange: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
  name: PropTypes.string,
};

export { Checkbox };
export default Checkbox;
