import React, { useState } from "react";
import PropTypes from "prop-types";
import { Text } from "./Text";

const validEmailRegex = RegExp(
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
);

const Email = ({ onChange, question, ...props }) => {
  const [email, setEmail] = useState(question.answer.entry);
  const [error, setError] = useState(false);

  const change = ({ target: { name, value } }) => {
    if (value.length > 0) {
      if (validEmailRegex.test(value)) {
        setError(false);
        onChange({ target: { name, value } });
      } else {
        setError("Please enter a valid email address");
      }
    } else {
      setError(false);
      onChange({ target: { name, value } });
    }

    setEmail(value);
  };

  return (
    <Text
      errorMessage={error}
      onChange={change}
      question={{ ...question, answer: { entry: email } }}
      {...props}
    />
  );
};
Email.propTypes = {
  onChange: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
};

export { Email };
export default Email;
