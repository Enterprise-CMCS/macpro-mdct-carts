import React from "react";
import PropTypes from "prop-types";

/*
 * modified default component from react-multi-select-component
 * (see here: https://rb.gy/7ibfx)
 *
 * the primary modification is the removal of the tabIndex attribute
 */

export const DropdownOption = ({ checked, option, onClick, disabled }) => (
  <div className={`item-renderer ${disabled ? "disabled" : ""}`}>
    <input
      type="checkbox"
      checked={checked}
      onChange={onClick}
      disabled={disabled}
    />
    <span>{option.label}</span>
  </div>
);

DropdownOption.propTypes = {
  checked: PropTypes.bool.isRequired,
  option: PropTypes.shape({
    value: PropTypes.any.isRequired,
    label: PropTypes.string.isRequired,
    key: PropTypes.string,
    disabled: PropTypes.bool,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
