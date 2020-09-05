import React from "react";
import { connect } from "react-redux";
import { Alert } from "@cmsgov/design-system-core";
import { selectFragment } from "../../store/formData";
import { _ } from "underscore";
import Question from "./Question";
import { selectQuestionsForPart } from "../../store/selectors";
import { shouldDisplay } from "../../util/shouldDisplay";

const showPart = (context_data, programType, state) => {
  if (
    context_data &&
    programType &&
    context_data.show_if_state_program_type_in &&
    !context_data.show_if_state_program_type_in.includes(programType)
  ) {
    return false;
  }

  return shouldDisplay(state, context_data);
};

const Part = ({
  context_data,
  partId,
  partNumber,
  questions,
  show,
  text,
  title,
}) => {
  let innards = null;
  if (show) {
    innards = (
      <>
        {text ? <p>{text}</p> : <></>}

        {questions.map((question) => (
          <Question key={question.id} question={question} />
        ))}
      </>
    );
  } else {
    innards = (
      <Alert>
        <p className="ds-c-alert__text">
          {context_data.skip_text ? <p>{context_data.skip_text}</p> : null}
        </p>
      </Alert>
    );
  }

  return (
    <div id={partId}>
      <h2>
        Part {partNumber}
        {title ? ": " + title : null}
      </h2>
      {innards}
    </div>
  );
};

const mapStateToProps = (state, { partId }) => {
  const part = selectFragment(state, partId);
  const questions = selectQuestionsForPart(state, partId);
  const contextData = part.context_data;

  return {
    context_data: part.context_data,
    questions,
    show: showPart(contextData, state.stateUser.programType, state),
    text: part ? part.text : null,
    title: part ? part.title : null,
  };
};

export default connect(mapStateToProps)(Part);
