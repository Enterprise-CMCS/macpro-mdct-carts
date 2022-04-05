import React from "react";
import PropTypes from "prop-types";
import { ChoiceList } from "@cmsgov/design-system-core";

const CheckboxFlag = ({ onChange, question, ...props }) => {
  const value = question.answer.entry || false;

  const change = ({ target: { name } }) => {
    onChange({ target: { name, value: !value } });
  };

  return (
    <ChoiceList
      label=""
      type="checkbox"
      choices={[{ label: "Select", value: true, checked: value }]}
      value={value}
      onChange={change}
      {...props}
    />
  );
};
CheckboxFlag.propTypes = {
  onChange: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
};

export { CheckboxFlag };
export default CheckboxFlag;
