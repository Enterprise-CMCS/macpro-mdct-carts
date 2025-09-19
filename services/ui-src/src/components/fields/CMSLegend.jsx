import React from "react";
import PropTypes from "prop-types";
import Text from "../layout/Text";
import { generateQuestionNumber } from "../utils/helperFunctions";

const CMSLegend = ({
  hideNumber = false,
  hint = "",
  id,
  label,
  questionType,
}) => {
  let labelBits = generateQuestionNumber(id);

  if (
    !questionType.includes("text") &&
    !questionType.includes("mailing_address") &&
    !questionType.includes("phone_number") &&
    !questionType.includes("email")
  ) {
    let legend = [];
    if (!hideNumber) legend.push(labelBits);
    legend.push(label);

    return (
      <>
        <legend className="label-header" data-testid="question-legend">
          {legend.join(" ")}
        </legend>
        {hint && (
          <div className="ds-c-field__hint" data-testid="legend-hint">
            <Text>{hint}</Text>
          </div>
        )}
      </>
    );
  } else {
    return null;
  }
};
CMSLegend.propTypes = {
  hideNumber: PropTypes.bool,
  hint: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  questionType: PropTypes.string.isRequired,
};

export { CMSLegend };
export default CMSLegend;
