import React, { Component } from "react";

class CMSLegend extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // Get ID as array split by hyphen
    let idArray = this.props.id.split("-");

    // Remove leading zero by enforcing the question number as a Number
    let questionNumber = Number(idArray[4]);
    return (
      <>
        <legend className="ds-c-label">
          {questionNumber}
          {idArray[5]}. {this.props.label}
        </legend>
      </>
    );
  }
}

export default CMSLegend;
