import React, { Component } from "react";

class CMSLegend extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // Get ID as array split by hyphen
    let idArray = this.props.id.split("-");

    // Get array length
    let length = idArray.length;

    // Create question number string
    let questionNumber;
    if (this.props.type === "subquestion") {
      questionNumber = Number(idArray[length - 2]) + idArray[length - 1] + ".";
    } else {
      questionNumber = Number(idArray[length - 1]) + ". ";
    }

    return (
      <>
        <legend className="ds-c-label">
          {questionNumber} {this.props.label}
        </legend>
      </>
    );
  }
}

export default CMSLegend;
