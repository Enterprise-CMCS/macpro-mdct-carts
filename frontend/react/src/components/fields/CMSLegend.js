import React, { Component } from "react";
class CMSLegend extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let questionId = this.props.id;
    let questionLabel = this.props.label;
    return (
      <legend className="ds-c-label">
        {questionId
          ? isNaN(questionId.substring(questionId.length - 2))
            ? parseInt(
                questionId.substring(
                  questionId.length - 4,
                  questionId.length - 2
                )
              ) +
              questionId.substring(questionId.length - 1) +
              ". " +
              questionLabel
            : parseInt(questionId.substring(questionId.length - 2)) +
              ". " +
              questionLabel
          : null}
      </legend>
    );
  }
}
export default CMSLegend;
