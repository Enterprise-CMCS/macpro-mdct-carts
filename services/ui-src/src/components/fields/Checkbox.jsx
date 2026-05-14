import React from "react";
import PropTypes from "prop-types";

const Checkbox = ({ onChange, question, ...props }) => {
  const selected = [question.answer.entry].flat().filter((v) => v != null);

  const change = ({ target: { name, value } }) => {
    const updated = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];

    onChange({ target: { name, value: updated.length > 0 ? updated : [] } });
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
            checked={selected.includes(checkBoxValue)}
            name={props.name}
          />
          <label
            className="label-radio"
            htmlFor={`${props.name}-${checkBoxValue}`}
          >
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
