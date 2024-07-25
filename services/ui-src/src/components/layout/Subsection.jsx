import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { selectSubsectionTitleAndPartIDs } from "../../store/selectors";
import Part from "./Part";
import Text from "./Text";

const Subsection = ({ partIds, subsectionId, title, text }) => {
  return (
    <div id={subsectionId}>
      <h1>This is a subsection</h1>
      {title && <h3 className="h3-pdf-bookmark">{title}</h3>}
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
        />
      ))}
    </div>
  );
};
Subsection.propTypes = {
  partIds: PropTypes.array.isRequired,
  subsectionId: PropTypes.string.isRequired,
  text: PropTypes.oneOf([PropTypes.string, null]),
  title: PropTypes.string,
};
Subsection.defaultProps = {
  text: null,
};

const mapStateToProps = (state, ownProps) => {
  const subsection = selectSubsectionTitleAndPartIDs(
    state,
    ownProps.subsectionId
  );
  return {
    partIds: subsection ? subsection.parts : [],
    title: subsection ? subsection.title : null,
    text: subsection ? subsection.text : null,
  };
};

export default connect(mapStateToProps)(Subsection);
