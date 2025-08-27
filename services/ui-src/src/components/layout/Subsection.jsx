import React from "react";
import { useSelector } from "react-redux";
//components
import Part from "./Part";
import Text from "./Text";
//selectors
import { selectSubsectionTitleAndPartIDs } from "../../store/selectors";
//types
import PropTypes from "prop-types";

const Subsection = ({ subsectionId, printView, existingSectionTitle }) => {
  const formData = useSelector((state) => state.formData);

  const subsection = selectSubsectionTitleAndPartIDs(formData, subsectionId);

  const partIds = subsection ? subsection.parts : [];
  const title = subsection ? subsection.title : null;
  const text = subsection ? subsection.text : null;

  return (
    <div id={subsectionId}>
      {title && <h2 className="h2-pdf-bookmark">{title}</h2>}
      {text ? (
        <div className="helper-text">
          <Text>{text}</Text>
        </div>
      ) : null}
      {partIds.map((partId, index) => (
        <Part
          key={partId}
          partId={partId}
          partNumber={partIds.length > 1 ? index + 1 : null}
          nestedSubsectionTitle={!!title}
          printView={printView}
          existingSectionTitle={existingSectionTitle}
        />
      ))}
    </div>
  );
};
Subsection.propTypes = {
  subsectionId: PropTypes.string.isRequired,
  printView: PropTypes.bool,
  existingSectionTitle: PropTypes.bool,
};
Subsection.defaultProps = {
  text: null,
};

export default Subsection;
