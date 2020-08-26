import React from "react";
import { connect } from "react-redux";
import {
  selectFragmentByJsonPath,
  winnowProperties,
} from "../../../store/formData";
import { setAnswerEntry } from "../../../actions/initial.js";
import { Choice, TextField } from "@cmsgov/design-system-core";
import { _ } from "underscore";

const validEmailRegex = RegExp(
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
);

const validTelephoneRegex = RegExp(
  /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
);

const TextFieldBase = ({
  fragment,
  changeFunc,
  multiline = null,
  rows = null,
  ...fieldProps
}) => {
  return (
    <TextField
      name={fragment.id}
      hint={fragment.hint}
      label={getLabelFromFragment(fragment)}
      value={(fragment.answer && fragment.answer.entry) || ""}
      onChange={_.partial(changeFunc, fragment.id)}
      type="text"
      multiline={multiline}
      rows={rows}
      disabled={fragment.answer && fragment.answer.readonly}
      {...fieldProps}
    />
  );
};
/* Question types */
const QuestionText = ({ fragment, changeFunc }) => {
  const isNotReallyTextQuestion =
    fragment.type === "text" ? "" : `Is actually ${fragment.type}`;
  const key = `qt-${fragment.id}`;
  return (
    <div className="test" key={key}>
      {isNotReallyTextQuestion}
      <TextFieldBase fragment={fragment} changeFunc={changeFunc} />
    </div>
  );
};

const QuestionTextSmall = ({ fragment, changeFunc }) => (
  <TextFieldBase fragment={fragment} changeFunc={changeFunc} />
);

const QuestionTextMedium = ({ fragment, changeFunc }) => (
  <TextFieldBase
    fragment={fragment}
    changeFunc={changeFunc}
    multiline={true}
    rows={3}
  />
);

const QuestionTextMultiline = ({ fragment, changeFunc }) => (
  <TextFieldBase
    fragment={fragment}
    changeFunc={changeFunc}
    multiline={true}
    rows={6}
  />
);

const QuestionTextMailingAddress = ({ fragment, changeFunc }) => (
  <TextFieldBase
    fragment={fragment}
    changeFunc={changeFunc}
    multiline={true}
    rows={4}
  />
);

const QuestionTextEmail = ({ fragment, changeFunc }) => {
  const valid = validEmailRegex.test(fragment.answer.entry);
  const errorMessage = valid
    ? null
    : "YOUR EMAIL ADDRESS IS AN OFFENSE AGAINST THE INTERNET";
  return (
    <TextFieldBase
      fragment={fragment}
      changeFunc={changeFunc}
      errorMessage={errorMessage}
    />
  );
};

const QuestionTextPhone = ({ fragment, changeFunc }) => {
  const valid = validTelephoneRegex.test(fragment.answer.entry);
  const errorMessage = valid
    ? null
    : "WE'RE CALLING YOU RIGHT NOW BUT YOU'RE NOT ANSWERING";
  return (
    <TextFieldBase
      fragment={fragment}
      changeFunc={changeFunc}
      errorMessage={errorMessage}
    />
  );
};

const QuestionRadio = ({ fragment, changeFunc }) => {
  return <QuestionCheckbox fragment={fragment} changeFunc={changeFunc} />;
};

const QuestionCheckbox = ({ fragment, changeFunc }) => {
  return (
    <>
      <legend className="ds-c-label">{getLabelFromFragment(fragment)}</legend>
      {Object.entries(fragment.answer.options).map((key, index) => {
        return (
          <Choice
            className="fpl-input"
            name={fragment.id}
            value={key[1]}
            hint={fragment.hint}
            type={fragment.type}
            checked={fragment.answer.entry === key[1] ? "checked" : null}
            conditional={fragment.conditional}
            onChange={_.partial(changeFunc, fragment.id)}
            disabled={fragment.answer.readonly}
          >
            {key[0]}
          </Choice>
        );
      })}
    </>
  );
};

/* /Question types */

// Map question types to functions:
const QuestionMap = new Map([
  ["checkbox", QuestionCheckbox],
  ["email", QuestionTextEmail],
  ["mailing_address", QuestionTextMailingAddress],
  ["phone_number", QuestionTextPhone],
  ["radio", QuestionRadio],
  ["text", QuestionText],
  ["text_small", QuestionTextSmall],
  ["text_medium", QuestionTextMedium],
  ["text_multiline", QuestionTextMultiline],
]);

// Connect question types to functions via their types:
const QuestionHolder = ({ fragment, elementId, changeFunc }) => {
  const Component = QuestionMap.has(fragment.type)
    ? QuestionMap.get(fragment.type)
    : QuestionMap.get("text");
  return (
    <Component
      fragment={fragment}
      changeFunc={changeFunc}
      elementId={elementId}
    />
  );
};

/* Helper functions for Questions */
const getQuestionLikeId = (fragment) => {
  if (fragment.id) {
    return fragment.id;
  } else if (
    fragment.type === "fieldset" &&
    fragment.fieldset_type === "marked"
  ) {
    return fragment.fieldset_info.id;
  }
  console.log("WTF", fragment);
  return null;
};

const getMarkerFromId = (id) => {
  if (id) {
    const last = id.split("-").slice(-1);
    //Return as is if it's a to z, otherwise turn it into a number to strip the leading zero:
    const marker = /^[a-z]{1,2}$/g.test(last) ? last : parseInt(last, 10);
    return marker;
  }
  return null;
};

const getLabelFromFragment = (fragment) => {
  const id = getQuestionLikeId(fragment);
  if (id && fragment.label) {
    const marker = getMarkerFromId(id);
    return `${marker}. ${fragment.label}`;
  } else if (fragment.label) {
    return fragment.label;
  }
  return null;
};

/* /Helper functions for Questions */

// The generic function for questions and question-like constructs:
const QuestionLike = ({ fragment, fragmentkey, setAnswer }) => {
  /* Debugging */
  const label = fragment.label ? <span>{fragment.label}</span> : <span></span>;
  const type = fragment.type ? <strong>{fragment.type}</strong> : <span></span>;
  const hint = fragment.hint ? <em>{fragment.hint}</em> : <span></span>;
  /* /Debugging */

  const fragmentId = getQuestionLikeId(fragment);
  const elementId = fragmentId ? fragmentId : fragmentkey;

  return fragment ? (
    <div id={elementId}>
      {/* Debugging 
    I am apparently a question-like thing of type {type} {label} {hint}
     /Debugging */}
      <QuestionHolder
        fragment={fragment}
        elementId={elementId}
        changeFunc={setAnswer}
      />
    </div>
  ) : null;
};

const mapStateToProps = (state, ownProps) => ({
  fragment: winnowProperties(selectFragmentByJsonPath(state, ownProps.jpexpr)),
  fragmentkey: ownProps.fragmentkey,
  abbr: state.stateUser.currentUser.state.id,
  year: state.global.formYear,
  programType: state.stateUser.programType,
  programName: state.stateUser.programName,
});

const mapDispatchToProps = {
  setAnswer: setAnswerEntry,
};
export default connect(mapStateToProps, mapDispatchToProps)(QuestionLike);
