import React from "react";
import { connect } from "react-redux";
import { selectFragment } from "../../store/formData";
import { _ } from "underscore";
import Question from "./Question";
import { selectQuestionsForPart } from "../../store/selectors";

const showPart = (context_data, programType) => {
  if (context_data &&
      programType &&
      _.has(context_data, "show_if_state_program_type_in") &&
      !context_data.show_if_state_program_type_in.includes(programType)) {
    return false;
  }
  return true;
}

const Part = ({ context_data, partId, programType, questions, text, title }) => {
  if (showPart(context_data, programType)) {
    return (
      <div id={partId}>
        {title ? <h2>{title}</h2> : <></>}
        {text ? <p>{text}</p> : <></>}
  
        {questions.map(question => <Question key={question.id} question={question} />)}
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
  const questions = selectQuestionsForPart(state, partId);
  return {
    context_data: _.has(part, "context_data") ? part.context_data : null,
    programType: state.stateUser.programType,
    questions,
    text: part ? part.text : null,
    title: part ? part.title : null,
  };
};

export default connect(mapStateToProps)(Part);
