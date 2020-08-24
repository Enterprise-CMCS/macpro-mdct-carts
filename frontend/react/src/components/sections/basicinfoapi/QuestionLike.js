import React from "react";
import { connect } from "react-redux";
import { extractSectionOrdinalFromJPExpr, selectFragmentByJsonPath, selectSectionByOrdinal, setAnswerEntry } from "../../../store/formData";
import { TextField } from "@cmsgov/design-system-core";
import { _ } from "underscore";

const TextFieldBase = (Data, fragment, changeFunc, multiline = null, rows = null) => {
  const label = getLabelFromFragment(fragment);
  const onChange = _.partial(changeFunc, fragment.id);
  return (
    <TextField
      name={fragment.id}
      hint={fragment.hint}
      label={label}
      value={fragment.answer.entry}
      onChange={onChange}
      type="text"
      multiline={multiline}
      rows={rows}
      disabled={fragment.answer.readonly}
    />

  )
}

/* Question types */
const QuestionText = (Data, fragment, setAnswer) => {
  const isNotReallyTextQuestion = fragment.type === "text" ? "" : `Is actually ${fragment.type}`;
  const key = `qt-${fragment.id}`;
  const tf = TextFieldBase(Data, fragment, setAnswer, null, null)
  return (

    <div className="test" key={key}>
      {isNotReallyTextQuestion}
      {tf}
    </div>
  )
};

const QuestionTextSmall = (Data, fragment, setAnswer) => {
  return TextFieldBase(Data, fragment, setAnswer, null, null);
};

const QuestionTextMedium = (Data, fragment, setAnswer) => {
  return TextFieldBase(Data, fragment, true, 3);
};

const QuestionTextMultiline = (Data, fragment, setAnswer) => {
  return TextFieldBase(Data, fragment, true, 6);
}

const QuestionTextEmail = (Data, fragment, setAnswer) => {
  return TextFieldBase(Data, fragment);
}
/* /Question types */

// Map question types to functions:
const QuestionMap = new Map([
  ["text", QuestionText],
  ["text_small", QuestionTextSmall],
  ["text_medium", QuestionTextMedium],
  ["text_multiline", QuestionTextMultiline],
])

// Connect question types to functions via their types:
const QuestionHolder = (Data, fragment, elementId, setAnswer) => {
  const func = QuestionMap.has(fragment.type) ? QuestionMap.get(fragment.type) : QuestionMap.get("text");
  return func(Data, fragment, setAnswer);
}

/* Helper functions for Questions */
const getQuestionLikeId = (fragment) => {
  if (fragment.id) {
    return fragment.id;
  } else if (fragment.type === "fieldset" && fragment.fieldset_type === "marked") {
    return fragment.fieldset_info.id;
  }
  console.log("WTF", fragment);
  return null;
}

const getMarkerFromId = (id) => {
  if (id) {
    const last = id.split("-").slice(-1);
    //Return as is if it's a to z, otherwise turn it into a number to strip the leading zero:
    const marker = /^[a-z]{1,2}$/g.test(last) ? last : parseInt(last, 10);
    return marker;
  }
  return null;
}

const getLabelFromFragment = (fragment) => {
  const id = getQuestionLikeId(fragment);
  if (id && fragment.label) {
    const marker = getMarkerFromId(id);
    return `${marker}. ${fragment.label}`
  } else if (fragment.label) {
    return fragment.label;
  }
  return null;
}
/* /Helper functions for Questions */

// The generic function for questions and question-like constructs:
const QuestionLike = ({Data, fragment, fragmentkey, setAnswer}) => {
  /* Debugging */
  const label = fragment.label ? <span>{fragment.label}</span> : <span></span>;
  const type = fragment.type ? <strong>{fragment.type}</strong> : <span></span>;
  const hint = fragment.hint ? <em>{fragment.hint}</em> : <span></span>;
  /* /Debugging */

  const fragmentId = getQuestionLikeId(fragment);
  const elementId = fragmentId ? fragmentId : fragmentkey;
  const body = QuestionHolder(Data, fragment, elementId, setAnswer);

  return fragment ? (
    <div id={elementId}>
    {/* Debugging */}
    I am a  question-like thing of type {type} {label} {hint}
    {/* /Debugging */}
    {body}
    </div>

  ) : null;
}

const mapStateToProps = (state, ownProps) => ({
  fragment: selectFragmentByJsonPath(state, ownProps.jpexpr),
  fragmentkey: ownProps.fragmentkey,
  abbr: state.stateUser.currentUser.state.id,
  year: state.global.formYear,
  Data: selectSectionByOrdinal(state, extractSectionOrdinalFromJPExpr(ownProps.jpexpr)),
  setAnswer: _.partial(setAnswerEntry, state),
  programType: state.stateUser.programType,
  programName: state.stateUser.programName,
});

export default connect(mapStateToProps)(QuestionLike);
