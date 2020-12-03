import React, { useState } from "react";
import PropTypes from "prop-types";
import { TextField } from "@cmsgov/design-system-core";
import ReactHtmlParser from "react-html-parser";

const Text = ({ question, ...props }) => {
  const [printValue, setPrintValue] = useState(
    (question.answer && question.answer.entry) || ""
  );

  const updatePrintHelper = ({ target: { value } }) => {
    const val = value.replace(/\n/g, "<br/>");
    setPrintValue(val);
  };
  return (
    <>
      <div className="print-helper">{ReactHtmlParser(printValue)}</div>
      <TextField
        value={(question.answer && question.answer.entry) || ""}
        type="text"
        label=""
        onBlur={updatePrintHelper}
        {...props}
      />
    </>
  );
};
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
