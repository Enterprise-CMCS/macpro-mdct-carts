import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Alert } from "@cmsgov/design-system";
// components
import Question from "../fields/Question";
import Text from "./Text";
// utils
import { selectFragment } from "../../store/formData";
import { selectQuestionsForPart } from "../../store/selectors";
import { shouldDisplay } from "../../util/shouldDisplay";

const Part = ({ partId, partNumber, nestedSubsectionTitle, printView }) => {
  const [, section] = partId.split("-");

  const { contextData, questions, show, text, title } = useSelector(
    (state) => getPartInfo(state, partId),
    shallowEqual
  );

  const getPartContent = () => {
    if (show) {
      return (
        <>
          {text && <Text data-testid="part-text">{text}</Text>}
          {questions.map((question) => (
            <Question
              key={question.id}
              question={question}
              tableTitle={title}
              data-testid="part-question"
              printView={printView}
            />
          ))}
        </>
      );
    } else {
      if (contextData) {
        return (
          <Alert>
            <div className="ds-c-alert__text" data-testid="part-alert">
              {contextData.skip_text && <p>{contextData.skip_text}</p>}
            </div>
          </Alert>
        );
      }
    }
  };

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
      {getPartContent()}
    </div>
  );
};

const getPartInfo = (state, partId) => {
  const { formData, reportStatus, allStatesData } = state;
  const currentUserRole = state.stateUser.currentUser.role;
  const stateUserAbbr = state.stateUser.abbr;
  const chipEnrollments = state.enrollmentCounts.chipEnrollments;

  const part = selectFragment(formData, partId);
  const partContextData = part.context_data;

  const questions = selectQuestionsForPart(
    formData,
    currentUserRole,
    reportStatus,
    allStatesData,
    stateUserAbbr,
    chipEnrollments,
    partId
  );
  const show = shouldDisplay(
    currentUserRole,
    formData,
    reportStatus,
    allStatesData,
    stateUserAbbr,
    chipEnrollments,
    partContextData
  );
  const text = part ? part.text : null;
  const title = part ? part.title : null;

  return {
    contextData: partContextData,
    questions,
    show,
    text,
    title,
  };
};

export default Part;
