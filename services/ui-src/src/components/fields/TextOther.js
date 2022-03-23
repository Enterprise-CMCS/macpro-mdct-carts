import React from "react";
import PropTypes from "prop-types";
import Text from "./Text";

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

export { TextMedium, TextMultiline, Text as TextSmall };
