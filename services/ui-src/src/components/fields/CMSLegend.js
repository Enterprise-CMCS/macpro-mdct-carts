import React from "react";
import PropTypes from "prop-types";
import Text from "../layout/Text";
import { generateQuestionNumber } from "../Utils/helperFunctions";

const CMSLegend = ({ hideNumber, hint, id, label, questionType }) => {
  let labelBits = generateQuestionNumber(id);

  if (
    !questionType.includes("text") &&
    !questionType.includes("mailing_address") &&
    !questionType.includes("phone_number") &&
    !questionType.includes("email") &&
    !questionType.includes("percentage")
  ) {
    return (
      <div>
        {!hideNumber && <p>{labelBits}</p>}
        {!questionType.includes("text") && (
          <h4 className="label-header" aria-label="Label Text">
            {label}
          </h4>
        )}
        {hint && (
          <div className="ds-c-field__hint" aria-label={`${label} hint`}>
            <Text>{hint}</Text>
          </div>
        )}
      </div>
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
