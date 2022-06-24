import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Alert } from "@cmsgov/design-system";

import { selectFragment } from "../../store/formData";
import Question from "../fields/Question";
import { selectQuestionsForPart } from "../../store/selectors";
import { shouldDisplay } from "../../util/shouldDisplay";
import Text from "./Text";
import { AppRoles } from "../../types";

const showPart = (contextData, programType, state) => {
  if (
    contextData &&
    programType &&
    contextData.show_if_state_program_type_in &&
    !contextData.show_if_state_program_type_in.includes(programType)
  ) {
    return false;
  }
  return shouldDisplay(state, contextData, programType);
};

const Part = ({
  context_data: contextData,
  partId,
  partNumber,
  questions,
  show,
  text,
  title,
}) => {
  let innards = null;

  const [, section] = partId.split("-");

  if (show) {
    innards = (
      <>
        {text ? <Text>{text}</Text> : null}

        {questions.map((question) => (
          <Question key={question.id} question={question} />
        ))}
      </>
    );
  } else {
    if (contextData) {
      innards = (
        <Alert>
          <div className="ds-c-alert__text">
            {contextData.skip_text ? <p>{contextData.skip_text}</p> : null}
          </div>
        </Alert>
      );
    }
  }

  return (
    <div id={partId}>
      {title && (
        <h4 className="h4-pdf-bookmark">
          {+section !== 0 && partNumber && `Part ${partNumber}: `}
          {title}
        </h4>
      )}
      {innards}
    </div>
  );
};
Part.propTypes = {
  context_data: PropTypes.object,
  partId: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  partNumber: PropTypes.number,
  questions: PropTypes.array.isRequired,
  show: PropTypes.bool.isRequired,
  text: PropTypes.string,
  title: PropTypes.string,
};
Part.defaultProps = {
  context_data: null,
  text: "",
  title: "",
};

const mapStateToProps = (state, { partId }) => {
  const part = selectFragment(state, partId);
  const questions = selectQuestionsForPart(state, partId);
  const contextData = part.context_data;
  const location = window.location.pathname.split("/");
  const userState = location[3]; // Current state, ie: "AL" or "CT"
  const programData = state.allStatesData.find(
    (element) => element.code === userState
  );

  return {
    context_data: part.context_data,
    questions,
    show: showPartBasedOnUserType(contextData, programData, state),
    text: part ? part.text : null,
    title: part ? part.title : null,
    isFetching: state.global.isFetching,
  };
};

export default connect(mapStateToProps)(Part);

/**
 * This function considers what arguments to invoke showPart() with based on user type.
 * Business and CO users do not have program types saved to their user objects in local state
 * @function showPartBasedOnUserType
 * @param {object} contextData - The context data for a Part from JSON
 * @param {object} programData - An object with the state's program type
 * @param {string} state - application state from redux
 * @returns {boolean} - determines if an element should show by invoking showPart()
 */
const showPartBasedOnUserType = (contextData, programData, state) => {
  const role = state.stateUser.currentUser.role;

  if (
    programData &&
    (role === AppRoles.CMS_ADMIN ||
      role === AppRoles.HELP_DESK ||
      role === AppRoles.CMS_USER ||
      role === AppRoles.STATE_USER)
  ) {
    // program type from programData object, for bus_user and co_user
    return showPart(contextData, programData.program_type, state);
  } else {
    // program type from stateUser object, for state_user's
    return showPart(contextData, state.stateUser.programType, state);
  }
};
