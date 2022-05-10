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
    ({ label, value: checkBoxValue }) => {
      console.log({ value });

      return (
        <div style={{ margin: "2rem 0" }} key={props.name + "-" + value}>
          <input
            id={props.name + "-" + value}
            key={value}
            type="checkbox"
            value={checkBoxValue}
            onChange={change}
            checked={value.indexOf(checkBoxValue) >= 0}
            name={props.name + value}
            {...props}
          />
          <label
            style={{ marginLeft: "2rem" }}
            htmlFor={props.name + "-" + value}
          >
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
};

export { Checkbox };
export default Checkbox;
