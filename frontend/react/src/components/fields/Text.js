import React from "react";
import PropTypes from "prop-types";
import { TextField } from "@cmsgov/design-system-core";

const Text = ({ question, ...props }) => (
  <TextField
    value={(question.answer && question.answer.entry) || ""}
    type="text"
    label=""
    disabled={(question.answer && question.answer.readonly) || false}
    {...props}
  />
);
Text.propTypes = {
  question: PropTypes.object.isRequired,
};

const TextMedium = ({ question, ...props }) => (
  <Text question={question} multiline rows={3} {...props} />
);
TextMedium.propTypes = {
  question: PropTypes.object.isRequired,
};

const TextMultiline = ({ question, ...props }) => (
  <Text question={question} multiline rows={6} {...props} />
);
TextMultiline.propTypes = {
  question: PropTypes.object.isRequired,
};

export { Text, TextMedium, TextMultiline, Text as TextSmall };
