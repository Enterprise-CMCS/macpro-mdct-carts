import React, { useState } from "react";
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
      }
    } else {
      setError(false);
      onChange({ target: { name, value } });
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

export { PhoneNumber };
