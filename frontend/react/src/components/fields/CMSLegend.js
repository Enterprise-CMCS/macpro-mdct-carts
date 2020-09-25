import React from "react";
import PropTypes from "prop-types";

const CMSLegend = ({ hideNumber, hint, id, label }) => {
  let labelBits = "";

  if (id) {
    const lastHunk = Number.parseInt(id.substring(id.length - 2), 10);
    if (Number.isNaN(lastHunk)) {
      const numberBit = Number.parseInt(
        id.substring(id.length - 4, id.length - 2),
        10
      );
      labelBits = `${numberBit}${id.substring(id.length - 1)}. `;
    } else {
      labelBits = `${lastHunk}. `;
    }
  }

  return (
    <legend className="ds-c-label">
      {!hideNumber && labelBits}
      {label}
      {hint && (
        <div className="ds-c-field__hint">
          {hint.split("\n").map((line) => (
            <div>{line}</div>
          ))}
        </div>
      )}
    </legend>
  );
};
CMSLegend.propTypes = {
  hideNumber: PropTypes.bool,
  hint: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};
CMSLegend.defaultProps = {
  hideNumber: false,
  hint: "",
};

export { CMSLegend };
export default CMSLegend;
