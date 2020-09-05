import React from "react";
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

const TextMedium = ({ question, ...props }) => (
  <Text question={question} multiline={true} rows={3} {...props} />
);

const TextMultiline = ({ question, ...props }) => (
  <Text question={question} multiline={true} rows={6} {...props} />
);

export { Text, TextMedium, TextMultiline, Text as TextSmall };
