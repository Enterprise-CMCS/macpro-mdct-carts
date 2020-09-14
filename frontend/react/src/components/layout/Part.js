import React from "react";
import { connect } from "react-redux";
import { selectFragment } from "../../store/formData";
import { _ } from "underscore";
import QuestionComponent from "../fields/QuestionComponent";

const showPart = (context_data, programType) => {
  if (context_data &&
    programType &&
    _.has(context_data, "show_if_state_program_type_in") &&
    !context_data.show_if_state_program_type_in.includes(programType)) {
    return false;
  }
  return true;
}

const Part = ({ partId, text, title, context_data, programType }) => {
  if (showPart(context_data, programType)) {

    // Determine Part Number from partId
    let partNum = Number(partId.split("-").pop());
    return (
      <div id={partId}>

        <h2>Part {partNum}{title ? ": " + title : <></>}</h2>
        {text ? <p>{text}</p> : <></>}

        <QuestionComponent partId={partId} />
      </div>
    );
  } else {
    return (
      <div id={partId}>
        {title ? <h2>{title}</h2> : <></>}
        {context_data.skip_text ? <p>{context_data.skip_text}</p> : <></>}

      </div>
    );

  }
};

const mapStateToProps = (state, { partId }) => {
  const part = selectFragment(state, partId);
  return {
    text: part ? part.text : null,
    title: part ? part.title : null,
    context_data: _.has(part, "context_data") ? part.context_data : null,
    programType: state.stateUser.programType,
  };
};

export default connect(mapStateToProps)(Part);
