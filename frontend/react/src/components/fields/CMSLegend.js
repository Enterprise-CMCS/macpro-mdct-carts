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
      console.log("is any of this working btw", splitIDArray.length);
      console.log("can i see it??", splitIDArray);

      if (this.props.type === "subquestion") {
        //question number will be some slices up subquestion ID
        // examples: 1282 "2020-03-f-01-15-a"
        // 1432 "2020-03-i-02-01-01-01"
        let letterIdx;
        for (let i = 0; i < splitIDArray.length; i++) {
          let element = splitIDArray[i];
          if (isLetter(element)) {
            letterIdx = i;
            break;
          }
        }
        // Pick up question
        // What is this actually for?? generating the last number??

        for (let g = letterIdx; g < splitIDArray.length; g++) {
          let partNumber = splitIDArray[letterIdx + 1];
          questionNumber = splitIDArray[letterIdx + 2];
          let subQuestionNumber = splitIDArray[letterIdx + 2];
        }
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
      <>
        <legend className="ds-c-label">
          {questionNumber}
          {/* {idArray[5]}. {this.props.label} */}
          {this.props.label}
        </legend>
      </>
    );
  }
}

export default CMSLegend;

function isLetter(character) {
  let lowerCaseRegex = /^[a-z]+$/;
  if (character.match(lowerCaseRegex)) {
    return true;
  }
  return false;
}
