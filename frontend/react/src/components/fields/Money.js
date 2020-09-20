import React from "react";
import PropTypes from "prop-types";
import { Integer } from "./Integer";

const Money = ({ ...props }) => {
  return <Integer {...props} inputMode="currency" mask="currency" />;
};
Money.propTypes = {
  onChange: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
};

export { Money };
export default Money;
