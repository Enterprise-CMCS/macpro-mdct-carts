import React from "react";
import PropTypes from "prop-types";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
// components
import { Checkbox } from "./Checkbox";
import { CheckboxFlag } from "./CheckboxFlag";
import { CMSLegend } from "./CMSLegend";
import { DateRange } from "./DateRange";
import { Email } from "./Email";
import { Fieldset } from "./Fieldset";
import UploadComponent from "../layout/UploadComponent";
import Integer from "./Integer";
import { MailingAddress } from "./MailingAddress";
import { Money } from "./Money";
import { Objectives } from "./Objectives";
import { Percentage } from "./Percentage";
import { PhoneNumber } from "./PhoneNumber";
import { Radio } from "./Radio";
import { Ranges } from "./Ranges";
import { Repeatables } from "./Repeatables";
import { SkipText } from "./SkipText";
import Text from "./Text";
import { TextMedium, TextMultiline, TextSmall } from "./TextOther";
// utils
import { setAnswerEntry } from "../../actions/initial";
import { selectIsFormEditable } from "../../store/selectors";
import { showQuestionByPath } from "../utils/helperFunctions";

export const questionTypes = new Map([
  ["checkbox", Checkbox],
  ["checkbox_flag", CheckboxFlag],
  ["daterange", DateRange],
  ["email", Email],
  ["fieldset", Fieldset],
  ["file_upload", UploadComponent],
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

const Container = ({ children }) => (
  <fieldset className="ds-c-fieldset">{children}</fieldset>
);
Container.propTypes = {
  question: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

const Question = ({
  "data-testid": dataTestId,
  disabled = false,
  hideNumber = false,
  // eslint-disable-next-line no-unused-vars
  hint,
  id,
  // eslint-disable-next-line no-unused-vars
  label,
  // eslint-disable-next-line no-unused-vars
  name,
  // eslint-disable-next-line no-unused-vars
  onChange,
  // eslint-disable-next-line no-unused-vars
  onClick,
  question,
  prevYear,
  printView = false,
  // eslint-disable-next-line no-unused-vars
  setAnswer,
  ...props
}) => {
  let Component = Text;
  if (questionTypes.has(question.type)) {
    Component = questionTypes.get(question.type);
  }

  const [stateUser, formData, formYear, reportStatus] = useSelector(
    (state) => [
      state.stateUser,
      state.formData,
      state.global.formYear,
      state.reportStatus,
    ],
    shallowEqual
  );
  const dispatch = useDispatch();

  const readonly = !selectIsFormEditable(
    reportStatus,
    formData,
    stateUser,
    formYear
  );

  const prevYearDisabled = prevYear ? prevYear.disabled : false;

  const handleOnChange = ({ target: { name: id, value } }) => {
    dispatch(setAnswerEntry(id, value));
  };

  const handleOnClick = (e) => {
    if (e.target.checked) {
      dispatch(setAnswerEntry(e.target.name, ""));
    } else if (e.target.checked !== undefined) {
      dispatch(setAnswerEntry(e.target.name, e.target.value));
    }
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

  function questionProps(questionType) {
    switch (questionType) {
      case "fieldset":
      case "integer":
        return { prevYear, printView };
      case "objectives":
      case "repeatables":
        return { printView };
      default:
        return {};
    }
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
            questionType={question.type}
          />
        )}
        <Component
          data-testid={dataTestId}
          id={id || question?.id}
          label={""}
          hint={undefined}
          question={question}
          name={question.id}
          onChange={handleOnChange}
          onClick={handleOnClick}
          disabled={
            prevYearDisabled ||
            pageDisable ||
            readonly ||
            (question.answer && question.answer.readonly) ||
            disabled
          }
          {...props}
          {...questionProps(question.type)}
        />

        {/* If there are subquestions, wrap them so they are indented with the
             blue line. But don't do it for the subquestions of a fieldset. If
             the fieldset is a subchild, it will already be indented; if it's
             not, then its children shouldn't be indented either. */}
        {shouldRenderChildren && (
          <div className="ds-c-choice__checkedChild">
            {question.questions.map((q, index) => (
              <Question
                key={q.id || `question-${index}`}
                question={q}
                setAnswer={setAnswerEntry}
                printView={printView}
              />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

Question.propTypes = {
  "data-testid": PropTypes.string,
  disabled: PropTypes.bool,
  hideNumber: PropTypes.bool,
  hint: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  question: PropTypes.object.isRequired,
  prevYear: PropTypes.object,
  printView: PropTypes.bool,
  setAnswer: PropTypes.func,
};
Question.defaultProps = {
  disabled: false,
  hideNumber: false,
  printView: false,
};

export default Question;
