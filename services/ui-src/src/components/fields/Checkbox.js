import React from "react";
import PropTypes from "prop-types";
import { Choice } from "@cmsgov/design-system-core";

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

  return question.answer.options.map(({ label, value: checkboxValue }) => (
    <Choice
      key={label}
      type="checkbox"
      checked={value.indexOf(checkboxValue) >= 0}
      value={checkboxValue}
      onChange={change}
      {...props}
    >
      {label}
    </Choice>
  ));
};
Checkbox.propTypes = {
  onChange: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
};

export { Checkbox };
export default Checkbox;
