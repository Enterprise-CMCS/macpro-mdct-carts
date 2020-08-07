import React, { Component } from "react";

class CMSHeader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // Get ID as array split by hyphen
    let idArray = this.props.id.split("-");

    // Get array length
    let length = idArray.length;

    // Create number string
    let questionNumber = Number(idArray[length - 1]) + ":";

    return (
      <>
        <h3>
          {this.props.type} {questionNumber} {this.props.title}
        </h3>
      </>
    );
  }
}

export default CMSHeader;
