import React from "react";
import PropTypes from "prop-types";
import DateRange from "../layout/DateRange";

const DateRangeWrapper = ({ onChange, question }) => {
  const changeHandler = ([questionId, data]) => {
    onChange({ target: { name: questionId, value: data } });
  };

  return <DateRange onChange={changeHandler} question={question} />;
};
DateRangeWrapper.propTypes = {
  onChange: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
};

export { DateRangeWrapper as DateRange };
export default DateRangeWrapper;
