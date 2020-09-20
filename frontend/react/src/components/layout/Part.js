import React from "react";
import { connect } from "react-redux";
import { selectFragment } from "../../store/formData";
import { _ } from "underscore";
import QuestionComponent from "../fields/QuestionComponent";
import { Alert } from "@cmsgov/design-system-core";
import { shouldDisplay } from "../../util/shouldDisplay";

const showPart = (context_data, programType, state) => {
  if (context_data &&
    programType &&
    _.has(context_data, "show_if_state_program_type_in") &&
    !context_data.show_if_state_program_type_in.includes(programType)) {
    return false;
  }

  if (context_data && _.has(context_data, "conditional_display")) {
    return shouldDisplay(state, context_data);
  }

  return true;
}

const Part = ({ partId, text, title, context_data, show }) => {
  // Determine Part Number from partId
  let partNum = Number(partId.split("-").pop());

  if (show) {
    return (
      <div id={partId}>
        <h2>Part {partNum}{title ? ": " + title : null}</h2>
        {text ? <p>{text}</p> : null}
        <QuestionComponent partId={partId} />
      </div>
    );
  } else {
    return (
      <div id={partId}>
        <h2>Part {partNum}{title ? ": " + title : null}</h2>
        <Alert>
          <p className="ds-c-alert__text">
            {context_data.skip_text ? <p>{context_data.skip_text}</p> : null}
          </p>
        </Alert>
      </div>
    );

  }
};

const mapStateToProps = (state, { partId }) => {
  const part = selectFragment(state, partId);
  const contextData = _.has(part, "context_data") ? part.context_data : null;

  return {
    text: part ? part.text : null,
    title: part ? part.title : null,
    context_data: _.has(part, "context_data") ? part.context_data : null,
    programType: state.stateUser.programType,
    show: showPart(contextData, state.stateUser.programType, state),
  };
};

export default connect(mapStateToProps)(Part);