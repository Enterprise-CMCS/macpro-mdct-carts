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
  Percentage,
  PhoneNumber,
  Radio,
  Ranges,
  SkipText,
  Text,
  TextMedium,
  TextMultiline,
  TextSmall,
} from "../fields";

import CMSLegend from "../fields/CMSLegend";
import { setAnswerEntry } from "../../actions/initial";
import { selectQuestion, selectQuestionsForPart } from "../../store/selectors";

// Not done:
// ==========================
// datagrid
// marked
// objective
// objectives
// repeatable
// repeatables
// synthesized_value
// synthesized_table
// noninteractive_table
// unmarked_descendants

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
  ["percentage", Percentage],
  ["phone_number", PhoneNumber],
  ["radio", Radio],
  ["ranges", Ranges],
  ["skip_text", SkipText],
  ["text", Text],
  ["text_medium", TextMedium],
  ["text_multiline", TextMultiline],
  ["text_small", TextSmall],
]);

const Question = ({ question, setAnswer }) => {
  let Component = Text;
  if (questionTypes.has(question.type)) {
    Component = questionTypes.get(question.type);
  }

  const onChange = (e) => {
    const id = e.target.name;
    const value = e.target.value;

    setAnswer(id, value);
  };

  const Container = question.type === 'fieldset' ?
    ({ children }) => <>{children}</> :
    ({ children }) => <fieldset className="ds-c-fieldset">{children}</fieldset>

  return (
    <div className="question">
      <Container>
        {question.label && (
          <legend className="ds-c-label">
            <CMSLegend id={question.id} label={question.label} />
          </legend>
        )}

        <Component question={question} name={question.id} onChange={onChange} />

        { /* If there are subquestions, wrap them so they are indented with the
             blue line. But don't do it for the subquestions of a fieldset. If
             the fieldset is a subchild, it will already be indented; if it's
             not, then its children shouldn't be indented either. */ }
        {question.type !== "fieldset" && question.type !== 'radio' &&
          question.questions &&
          question.questions.length > 0 && (
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
