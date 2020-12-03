import React, { useState } from "react";
import PropTypes from "prop-types";
import { Text } from "./Text";

const PhoneNumber = ({ onChange, question, ...props }) => {
  const [phone, setPhone] = useState(question.answer.entry);
  const [error, setError] = useState(false);

  const change = ({ target: { name, value } }) => {
    if (value.length > 0) {
      const digits = value.replace(/[()-. ]/g, "");
      if (digits.length > 10) {
        setError("Please limit to 10 digits");
      } else {
        setError(false);
        onChange({ target: { name, value } });
      }
    } else {
      setError(false);
    }

    setPhone(value);
  };

  return (
    <Text
      errorMessage={error}
      onChange={change}
      numeric
      question={{ ...question, answer: { entry: phone } }}
      {...props}
    />
  );
};
PhoneNumber.propTypes = {
  onChange: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
};

export { PhoneNumber };
export default PhoneNumber;
