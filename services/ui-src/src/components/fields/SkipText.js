import React from "react";
import PropTypes from "prop-types";
import { Alert } from "@cmsgov/design-system-core";

const SkipText = ({ question: { skip_text: skipText } }) => (
  <Alert>
    <p className="ds-c-alert__text">{skipText}</p>
  </Alert>
);
SkipText.propTypes = {
  question: PropTypes.shape({
    skip_text: PropTypes.string.isRequired,
  }).isRequired,
};

export { SkipText };
export default SkipText;
