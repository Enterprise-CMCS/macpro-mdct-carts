import React from "react";
import PropTypes from "prop-types";
import { ChoiceList } from "@cmsgov/design-system-core";

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

  const choices = question.answer.options.map((option) => ({
    checked: value.indexOf(option.value) >= 0,
    label: option.label,
    value: option.value,
  }));

  return (
    <ChoiceList
      label=""
      type="checkbox"
      choices={choices}
      value={value}
      onChange={change}
      {...props}
    />
  );
};
Checkbox.propTypes = {
  onChange: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
};

export { Checkbox };
export default Checkbox;
