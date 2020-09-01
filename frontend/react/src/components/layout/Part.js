import React from "react";
import { connect } from "react-redux";
import { selectPartTitleAndQuestionIDs } from "../../store/formData";

import QuestionComponent from "../fields/QuestionComponent";

const Part = ({ partId, text, title }) => {
  return (
    <div id={partId}>
      {title ? <h2>{title}</h2> : <></>}
      {text ? <p>{text}</p> : <></>}

      <QuestionComponent partId={partId} />
    </div>
  );
};

const mapStateToProps = (state, { partId }) => {
  const part = selectPartTitleAndQuestionIDs(state, partId);
  return {
    text: part ? part.text : null,
    title: part ? part.title : null,
  };
};

export default connect(mapStateToProps)(Part);
