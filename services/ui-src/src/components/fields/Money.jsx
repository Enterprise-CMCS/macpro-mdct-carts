import React from "react";
import PropTypes from "prop-types";
import Integer from "./Integer";

const Money = ({ question }) => {
  return <Integer question={question} inputMode="currency" mask="currency" />;
};
Money.propTypes = {
  onChange: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
};

export { Money };
export default Money;
