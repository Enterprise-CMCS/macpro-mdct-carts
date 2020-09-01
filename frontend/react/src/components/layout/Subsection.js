import React from "react";
import { connect } from "react-redux";
import { selectSubsectionTitleAndPartIDs } from "../../store/selectors";
import Part from "./Part";

const Subsection = ({ partIds, subsectionId, title }) => {
  return (
    <div id={subsectionId}>
      <h2>{title}</h2>
      {partIds.map((partId) => (
        <Part key={partId} partId={partId} />
      ))}
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  const subsection = selectSubsectionTitleAndPartIDs(
    state,
    ownProps.subsectionId
  );
  return {
    partIds: subsection ? subsection.parts : [],
    title: subsection ? subsection.title : null,
  };
};

export default connect(mapStateToProps)(Subsection);
