import React from "react";
import PropTypes from "prop-types";
import DateRange from "../layout/DateRange";

export const DateRangeWrapper = ({ onChange, question, ...props }) => {
  const changeHandler = ([questionId, data]) => {
    onChange({ target: { name: questionId, value: data } });
  };

  return <DateRange onChange={changeHandler} question={question} {...props} />;
};
DateRangeWrapper.propTypes = {
  onChange: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
};
