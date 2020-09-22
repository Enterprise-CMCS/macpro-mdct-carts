import React from "react";
import PropTypes from "prop-types";

const CMSLegend = ({ id, label }) => {
  if (id) {
    const lastHunk = Number.parseInt(id.substring(id.length - 2), 10);

    return (
      <legend className="ds-c-label">
        {Number.isNaN(lastHunk)
          ? `${Number.parseInt(
              id.substring(id.length - 4, id.length - 2),
              10
            )}${id.substring(id.length - 1)}. ${label}`
          : `${lastHunk}. ${label}`}
      </legend>
    );
  }

  return <legend className="ds-c-label" />;
};
CMSLegend.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export { CMSLegend };
export default CMSLegend;
