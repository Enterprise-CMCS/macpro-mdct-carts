import React from "react";
import { connect } from "react-redux";
import { extractSectionOrdinalFromJPExpr, selectFragmentByJsonPath, selectSectionByOrdinal } from "../../../store/formData";
import { setAnswerEntry } from "../../../actions/initial.js";
import { TextField } from "@cmsgov/design-system-core";
import { _ } from "underscore";
import CMSChoice from "../../fields/CMSChoice";

const TextFieldBase = ({Data, fragment, changeFunc, multiline = null, rows = null}) => {
    return (
    <TextField
      name={fragment.id}
      hint={fragment.hint}
      label={getLabelFromFragment(fragment)}
      value={fragment.answer.entry}
      onChange={_.partial(changeFunc, fragment.id)}
      type="text"
      multiline={multiline}
      rows={rows}
      disabled={fragment.answer.readonly}
    />
);
}
/* Question types */
const QuestionText = ({Data, fragment, changeFunc}) => {
  const isNotReallyTextQuestion = fragment.type === "text" ? "" : `Is actually ${fragment.type}`;
  const key = `qt-${fragment.id}`;
  return (

    <div className="test" key={key}>
      {isNotReallyTextQuestion}
      <TextFieldBase Data={Data} fragment={fragment} changeFunc={changeFunc} />
    </div>
  )
};

const QuestionTextSmall = ({Data, fragment, changeFunc}) => (
  <TextFieldBase Data={Data} fragment={fragment} changeFunc={changeFunc} />
);

const QuestionTextMedium = ({Data, fragment, changeFunc}) => (
  <TextFieldBase Data={Data} fragment={fragment} changeFunc={changeFunc} multiline={true} rows={3} />
);

const QuestionTextMultiline = ({Data, fragment, changeFunc}) => (
  <TextFieldBase Data={Data} fragment={fragment} changeFunc={changeFunc} multiline={true} rows={6} />
);

const QuestionTextEmail = ({Data, fragment, changeFunc}) => {
  return (
    <TextFieldBase Data={Data} fragment={fragment} changeFunc={changeFunc} />
);
}

const QuestionRadio = ({Data, fragment, changeFunc}) => {
  Object.entries(fragment.answer.options).map( (key, index) => {
    return (
      <CMSChoice
        name={fragment.id}
        value={key[1]}
        label={key[0]}
        type={fragment.type}
        answer={fragment.answer.entry}
        conditional={fragment.conditional}
        children={fragment.fragments}
        valueFromParent={fragment.answer.entry}
        onChange={changeFunc}
      />
    )
  })
}

const QuestionCheckbox = ({Data, fragment, changeFunc}) => {
  Object.entries(fragment.answer.options).map( (key, index) => {
    return (
      <CMSChoice
        name={fragment.id}
        value={key[1]}
        label={key[0]}
        type={fragment.type}
        answer={fragment.answer.entry}
        conditional={fragment.conditional}
        children={fragment.fragments}
        valueFromParent={fragment.answer.entry}
        onChange={changeFunc}
      />
    )
  })
}


/* /Question types */

// Map question types to functions:
const QuestionMap = new Map([
  ["xcheckbox", QuestionCheckbox],
  ["email", QuestionTextEmail],
  ["xradio", QuestionRadio],
  ["text", QuestionText],
  ["text_small", QuestionTextSmall],
  ["text_medium", QuestionTextMedium],
  ["text_multiline", QuestionTextMultiline],
])

// Connect question types to functions via their types:
const QuestionHolder = ({Data, fragment, elementId, changeFunc}) => {
  const Component = QuestionMap.has(fragment.type) ? QuestionMap.get(fragment.type) : QuestionMap.get("text");
  return (
      <Component Data={Data} fragment={fragment} changeFunc={changeFunc} elementId={elementId} />
  )
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
  const yo = type === "email" ? console.log : _.partial(setAnswer, "2020-00-a-02-04", {target: {value: "I am so lost"}})
  /* /Debugging */

  const fragmentId = getQuestionLikeId(fragment);
  const elementId = fragmentId ? fragmentId : fragmentkey;
  //const body = QuestionHolder(Data, fragment, elementId, setAnswer);

  return fragment ? (
    <div id={elementId} xonClick={yo}>
    {/* Debugging */}
    I am apparently a question-like thing of type {type} {label} {hint}
    {/* /Debugging */}
    <QuestionHolder Data={Data} fragment={fragment} elementId={elementId} changeFunc={setAnswer} />
    </div>

  ) : null;
}

const mapStateToProps = (state, ownProps) => ({
  fragment: selectFragmentByJsonPath(state, ownProps.jpexpr),
  fragmentkey: ownProps.fragmentkey,
  abbr: state.stateUser.currentUser.state.id,
  year: state.global.formYear,
  Data: selectSectionByOrdinal(state, extractSectionOrdinalFromJPExpr(ownProps.jpexpr)) && true,
  programType: state.stateUser.programType,
  programName: state.stateUser.programName,
});

const mapDispatchToProps = {
    setAnswer: setAnswerEntry
}
export default connect(mapStateToProps, mapDispatchToProps)(QuestionLike);
