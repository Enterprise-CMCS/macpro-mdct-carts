import React from "react";
import { connect } from "react-redux";
import { selectFragmentById, selectSectionByOrdinal } from "../../../store/formData";
import Part from "./Part";

const Subsection = ({ Data, fragment, subsectionId }) => {
  const title = fragment.title ? <h2>{fragment.title}</h2> : <span></span>;
  return Data? (
    <div id={fragment.id}>
    I am a subsection
    {title}
    {fragment.parts.map((part) => (
      <Part key={part.id} partId={part.id}/>
    ))}
    
      
    </div>

  ) : null;
}

const mapStateToProps = (state, ownProps) => ({
  fragment: selectFragmentById(state, ownProps.subsectionId),
  subsectionId: ownProps.subsectionId,
  abbr: state.stateUser.currentUser.state.id,
  year: state.global.formYear,
  Data: selectSectionByOrdinal(state, 0),
  programType: state.stateUser.programType,
  programName: state.stateUser.programName,
});

export default connect(mapStateToProps)(Subsection);

