import React from "react";
import { connect } from "react-redux";
import { selectSubsectionTitleAndPartIDs } from "../../store/selectors";
import Part from "./Part";

const Subsection = ({ partIds, subsectionId, title, text, text_2 }) => {
  return (
    <div id={subsectionId}>
      <h2>{title}</h2>
      {text ? <div className="helper-text">{text}</div> : null}
      {text_2 ? <div className="helper-text"><p>{text_2}</p></div> : null}
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
    text_2: subsection ? subsection.text_2 : null,
  };
};

export default connect(mapStateToProps)(Subsection);
