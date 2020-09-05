import React from "react";
import { Alert } from "@cmsgov/design-system-core";

const SkipText = ({ question: { skip_text: skipText } }) => (
  <Alert>
    <p className="ds-c-alert__text">{skipText}</p>
  </Alert>
);

export { SkipText };
