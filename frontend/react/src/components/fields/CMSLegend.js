import React from "react";
import PropTypes from "prop-types";
import Text from "../layout/Text";

const CMSLegend = ({ hideNumber, hint, id, label, questionType }) => {
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

  if (
    !questionType.includes("text") &&
    !questionType.includes("mailing_address") &&
    !questionType.includes("phone_number") &&
    !questionType.includes("email") &&
    !questionType.includes("percentage")
  ) {
    return (
      <p>
        {!hideNumber && labelBits}
        {!questionType.includes("text") && label}
        {hint && (
          <div className="ds-c-field__hint">
            <Text>{hint}</Text>
          </div>
        )}
      </p>
    );
  } else {
    return null;
  }
};
CMSLegend.propTypes = {
  hideNumber: PropTypes.bool,
  hint: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  questionType: PropTypes.string.isRequired,
};
CMSLegend.defaultProps = {
  hideNumber: false,
  hint: "",
};

export { CMSLegend };
export default CMSLegend;
