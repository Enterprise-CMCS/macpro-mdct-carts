import React, { Component } from "react";

class CMSLegend extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // Create question number string

    let questionNumber;

    if (this.props.id) {
      let splitIDArray = this.props.id.split("-");

      if (this.props.type === "subquestion") {
        //question number will be some slices up subquestion ID
      } else {
        let lastNumber = splitIDArray.slice(-1);
        questionNumber = `${Number(lastNumber)}:`;
      }
    }

    // if (this.props.id) {
    //   if (this.props.type === "subquestion") {
    //     questionNumber =
    //       Number(this.props.id.split("-").slice(-2, -1)) +
    //       this.props.id.split("-").slice(-1) +
    //       ":";
    //   } else {
    //     questionNumber = Number(this.props.id.split("-").slice(-1)) + ":";
    //   }
    // }

    return (
      <legend className="ds-c-label">
        {questionNumber} {this.props.label}
      </legend>
    );
  }
}

export default CMSLegend;
