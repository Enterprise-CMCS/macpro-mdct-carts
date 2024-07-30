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

const Part = ({ partId, partNumber, nestedSubsectionTitle }) => {
  const [, section] = partId.split("-");
  const { contextData, questions, show, text, title } = useSelector(
    (state) => mapStateToProps(state, partId),
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

const mapStateToProps = (state, partId) => {
  const part = selectFragment(state, partId);
  const partContextData = part.context_data;

  return {
    contextData: partContextData,
    questions: selectQuestionsForPart(state, partId),
    show: shouldDisplay(state, partContextData),
    text: part ? part.text : null,
    title: part ? part.title : null,
  };
};

export default Part;
