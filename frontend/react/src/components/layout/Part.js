import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Alert } from "@cmsgov/design-system-core";

import { selectFragment } from "../../store/formData";
import Question from "../fields/Question";
import { selectQuestionsForPart } from "../../store/selectors";
import { shouldDisplay } from "../../util/shouldDisplay";
import Text from "./Text";

const showPart = (contextData, programType, state) => {
  if (
    contextData &&
    programType &&
    contextData.show_if_state_program_type_in &&
    !contextData.show_if_state_program_type_in.includes(programType)
  ) {
    return false;
  }

  return shouldDisplay(state, contextData);
};

const Part = ({
  context_data: contextData,
  partId,
  partNumber,
  questions,
  show,
  text,
  title,
}) => {
  let innards = null;

  const [, section] = partId.split("-");

  if (show) {
    innards = (
      <>
        {text ? <Text>{text}</Text> : null}

        {questions.map((question) => (
          <Question key={question.id} question={question} />
        ))}
      </>
    );
  } else {
    innards = (
      <Alert>
        <div className="ds-c-alert__text">
          {contextData.skip_text ? <p>{contextData.skip_text}</p> : null}
        </div>
      </Alert>
    );
  }

  return (
    <div id={partId}>
      <h2>
        {+section !== 0 && partNumber && `Part ${partNumber}: `}
        {title ? `${title}` : null}
      </h2>
      {innards}
    </div>
  );
};
Part.propTypes = {
  context_data: PropTypes.object,
  partId: PropTypes.oneOf([PropTypes.string, null]).isRequired,
  partNumber: PropTypes.number.isRequired,
  questions: PropTypes.array.isRequired,
  show: PropTypes.bool.isRequired,
  text: PropTypes.string,
  title: PropTypes.string,
};
Part.defaultProps = {
  context_data: null,
  text: "",
  title: "",
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
    isFetching: state.global.isFetching,
  };
};

export default connect(mapStateToProps)(Part);
