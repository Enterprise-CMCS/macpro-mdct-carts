import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { selectSubsectionTitleAndPartIDs } from "../../store/selectors";
import Part from "./Part";

const Subsection = ({ partIds, subsectionId, title, text }) => {
  return (
    <div id={subsectionId}>
      <h2>{title}</h2>
      {text ? (
        <div className="helper-text">
          {text.split("\n").map((paragraph) => (
            <p>{paragraph}</p>
          ))}
        </div>
      ) : null}
      {partIds.map((partId, index) => (
        <Part
          key={partId}
          partId={partId}
          partNumber={partIds.length > 1 ? index + 1 : null}
        />
      ))}
    </div>
  );
};
Subsection.propTypes = {
  partIds: PropTypes.array.isRequired,
  subsectionId: PropTypes.string.isRequired,
  text: PropTypes.oneOf([PropTypes.string, null]),
  title: PropTypes.string.isRequired,
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
