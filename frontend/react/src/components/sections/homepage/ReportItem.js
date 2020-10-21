import React, { Component } from "react";

class ReportItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let link1Text = this.props.link1Text ? this.props.link1Text : "View only";
    let link1URL = this.props.link1URL ? this.props.link1URL : "#";
    let statusText = this.props.statusText
      ? this.props.statusText
      : "Submitted";

    let statusURL = this.props.statusURL ? (
      <a href={this.props.statusURL}> {statusText} </a>
    ) : (
      statusText
    );

    let anchorTarget = this.props.link1Text === "Edit" ? "_self" : "_blank";
    const shortenEmail = (email) => {
      return email.substring(0, email.indexOf("@"));
    };

    const editorURL = (
      <a href={`${this.props.editor}`}> {shortenEmail(this.props.editor)} </a>
    );
    return (
      <div className="report-item ds-l-row">
        <div className="name ds-l-col--1">{this.props.name}</div>
        <div
          className={`status ds-l-col--2 ${
            statusText === "Overdue" && `alert`
          }`}
        >
          {statusURL}
        </div>
        <div className="actions ds-l-col--3">
          <a href={link1URL} target={anchorTarget}>
            {link1Text}
          </a>
        </div>
      </div>
    );
  }
}

export default ReportItem;
