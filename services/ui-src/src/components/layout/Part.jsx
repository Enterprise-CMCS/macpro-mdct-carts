import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Alert } from "@cmsgov/design-system";

import { selectFragment } from "../../store/formData";
import Question from "../fields/Question";
import { selectQuestionsForPart } from "../../store/selectors";
import { shouldDisplay } from "../../util/shouldDisplay";
import Text from "./Text";

const Part = ({
  context_data: contextData,
  partId,
  partNumber,
  questions,
  show,
  text,
  title,
  nestedSubsectionTitle,
}) => {
  let innards = null;

  const [, section] = partId.split("-");

  if (show) {
    innards = (
      <>
        {text ? <Text data-testid="part-text">{text}</Text> : null}

        {questions.map((question) => (
          <Question
            key={question.id}
            question={question}
            tableTitle={title}
            data-testid="part-question"
          />
        ))}
      </>
    );
  } else {
    if (contextData) {
      innards = (
        <Alert>
          <div className="ds-c-alert__text" data-testid="part-alert">
            {contextData.skip_text ? <p>{contextData.skip_text}</p> : null}
          </div>
        </Alert>
      );
    }
  }

  return (
    <div id={partId} data-testid="part">
      {title &&
        (nestedSubsectionTitle ? (
          <h4 className="h4-pdf-bookmark" data-testid="part-sub-header">
            {+section !== 0 && partNumber && `Part ${partNumber}: `}
            {title}
          </h4>
        ) : (
          <h3 className="h3-pdf-bookmark" data-testid="part-header">
            {+section !== 0 && partNumber && `Part ${partNumber}: `}
            {title}
          </h3>
        ))}
      {innards}
    </div>
  );
};
Part.propTypes = {
  context_data: PropTypes.object,
  partId: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  partNumber: PropTypes.number,
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
    show: shouldDisplay(state, contextData),
    text: part ? part.text : null,
    title: part ? part.title : null,
    isFetching: state.global.isFetching,
  };
};

export default connect(mapStateToProps)(Part);
