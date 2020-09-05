import React from "react";
import DateRange from "../layout/DateRange";

const DateRangeWrapper = ({ onChange, question }) => {
  const changeHandler = ([questionId, data]) => {
    onChange({ target: { name: questionId, value: data } });
  };

  return <DateRange onChange={changeHandler} question={question} />;
};

export { DateRangeWrapper as DateRange };
