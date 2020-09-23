import React from "react";
import { connect } from "react-redux";
import { selectSubsectionTitleAndPartIDs } from "../../store/selectors";
import Part from "./Part";

const Subsection = ({ partIds, subsectionId, title, text }) => {
  return (
    <div id={subsectionId}>
      <h2>{title}</h2>
      {text ? <div className="helper-text">{text.split("\n").map(paragraph => <p>{paragraph}</p>)}</div> : null}
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
    text: subsection ? subsection.text : null,
  };
};

export default connect(mapStateToProps)(Subsection);
