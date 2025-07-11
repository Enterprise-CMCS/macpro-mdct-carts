import React from "react";
import PropTypes from "prop-types";
import Integer from "./Integer";

const Money = ({ ...props }) => {
  return <Integer {...props} inputMode="currency" mask="currency" />;
};
Money.propTypes = {
  className: PropTypes.string,
  "data-testid": PropTypes.string,
  disabled: PropTypes.bool,
  hint: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  prevYear: PropTypes.object,
  printView: PropTypes.bool,
  question: PropTypes.object.isRequired,
  value: PropTypes.string,
};
Money.defaultProps = {
  disabled: false,
  printView: false,
};
export { Money };
export default Money;
