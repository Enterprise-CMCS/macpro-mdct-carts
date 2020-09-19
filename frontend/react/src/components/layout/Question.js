import React from "react";
import { connect } from "react-redux";

import {
  Checkbox,
  CheckboxFlag,
  DateRange,
  Email,
  Fieldset,
  FileUpload,
  Integer,
  MailingAddress,
  Money,
  Objectives,
  Percentage,
  PhoneNumber,
  Radio,
  Ranges,
  Repeatables,
  SkipText,
  Text,
  TextMedium,
  TextMultiline,
  TextSmall,
} from "../fields";

import CMSLegend from "../fields/CMSLegend";
import { setAnswerEntry } from "../../actions/initial";

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

const Question = ({ question, setAnswer, ...props }) => {
  let Component = Text;
  if (questionTypes.has(question.type)) {
    Component = questionTypes.get(question.type);
  }

  const onChange = (e) => {
    const id = e.target.name;
    const value = e.target.value;

    setAnswer(id, value);
  };

  const shouldRenderChildren =
    question.type !== "fieldset" &&
    question.type !== "objectives" &&
    question.type !== "radio" &&
    question.type !== "repeatables" &&
    question.questions &&
    question.questions.length > 0;

  return (
    <div className="question">
      <Container question={question}>
        {question.label && (
          <legend className="ds-c-label">
            <CMSLegend id={question.id} label={question.label} />
          </legend>
        )}

        <Component
          {...props}
          question={question}
          name={question.id}
          onChange={onChange}
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

const mapDispatchToProps = {
  setAnswer: setAnswerEntry,
};

export default connect(null, mapDispatchToProps)(Question);
