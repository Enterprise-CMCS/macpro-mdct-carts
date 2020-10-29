import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

/* eslint-disable import/no-cycle */
import { Checkbox } from "./Checkbox";
import { CheckboxFlag } from "./CheckboxFlag";
import { CMSLegend } from "./CMSLegend";
import { DateRange } from "./DateRange";
import { Email } from "./Email";
import { Fieldset } from "./Fieldset";
import { FileUpload } from "./FileUpload";
import { Integer } from "./Integer";
import { MailingAddress } from "./MailingAddress";
import { Money } from "./Money";
import { Objectives } from "./Objectives";
import { Percentage } from "./Percentage";
import { PhoneNumber } from "./PhoneNumber";
import { Radio } from "./Radio";
import { Ranges } from "./Ranges";
import { Repeatables } from "./Repeatables";
import { SkipText } from "./SkipText";
import { Text, TextMedium, TextMultiline, TextSmall } from "./Text";
/* eslint-enable */

import { setAnswerEntry } from "../../actions/initial";
import { selectIsFormEditable } from "../../store/selectors";
import { showQuestionByPath } from "../Utils/helperFunctions";

const questionTypes = new Map([
  ["checkbox", Checkbox],
  ["checkbox_flag", CheckboxFlag],
  ["daterange", DateRange],
  ["email", Email],
  ["fieldset", Fieldset],
  ["file_upload", FileUpload], // this one is functionally incomplete
  ["integer", Integer],
  ["mailing_address", MailingAddress],
  ["money", Money],
  ["objectives", Objectives],
  ["percentage", Percentage],
  ["phone_number", PhoneNumber],
  ["radio", Radio],
  ["ranges", Ranges],
  ["repeatables", Repeatables],
  ["skip_text", SkipText],
  ["text", Text],
  ["text_medium", TextMedium],
  ["text_multiline", TextMultiline],
  ["text_small", TextSmall],
]);

const Container = ({ question, children }) =>
  question.type === "fieldset" ? (
    <>{children}</>
  ) : (
    <fieldset className="ds-c-fieldset">{children}</fieldset>
  );
Container.propTypes = {
  question: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

const Question = ({ hideNumber, question, readonly, setAnswer, ...props }) => {
  let Component = Text;
  if (questionTypes.has(question.type)) {
    Component = questionTypes.get(question.type);
  }

  const onChange = ({ target: { name: id, value } }) => {
    setAnswer(id, value);
  };

  const shouldRenderChildren =
    (question.type !== "fieldset" ||
      question.fieldset_type === "noninteractive_table") &&
    question.type !== "objectives" &&
    question.type !== "radio" &&
    question.type !== "repeatables" &&
    question.questions &&
    question.questions.length > 0;

  let fieldsetId = false;
  if (question.type === "fieldset") {
    if (question.fieldset_info) {
      fieldsetId = question.fieldset_info.id;
    }
  }

  // Check if question should be shown based on pathname
  const pageDisable = showQuestionByPath(window.location.pathname);

  // Disable the File Upload component for launch since it is not fully functional
  if (question.type === "file_upload") {
    question.answer.readonly = true;
    question.hint = "Currently unavailable";
  }

  return (
    <div className="question">
      <Container question={question}>
        {question.label && (
          <CMSLegend
            hideNumber={hideNumber}
            hint={question.hint}
            id={fieldsetId || question.id}
            label={question.label}
          />
        )}

        <Component
          {...props}
          question={question}
          name={question.id}
          onChange={onChange}
          disabled={
            pageDisable ||
            readonly ||
            (question.answer && question.answer.readonly) ||
            false
          }
        />

        {/* If there are subquestions, wrap them so they are indented with the
             blue line. But don't do it for the subquestions of a fieldset. If
             the fieldset is a subchild, it will already be indented; if it's
             not, then its children shouldn't be indented either. */}
        {shouldRenderChildren && (
          <div className="ds-c-choice__checkedChild">
            {question.questions.map((q) => (
              <Question key={q.id} question={q} setAnswer={setAnswer} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};
Question.propTypes = {
  hideNumber: PropTypes.bool,
  question: PropTypes.object.isRequired,
  readonly: PropTypes.bool.isRequired,
  setAnswer: PropTypes.func.isRequired,
};
Question.defaultProps = {
  hideNumber: false,
};

const mapState = (state) => ({
  readonly: !selectIsFormEditable(state),
});

const mapDispatchToProps = {
  setAnswer: setAnswerEntry,
};

export default connect(mapState, mapDispatchToProps)(Question);
