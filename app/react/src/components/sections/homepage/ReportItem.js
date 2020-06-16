import React, { Component } from "react";

class ReportItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let link1Text = this.props.link1Text ? this.props.link1Text : "Download";
    let link1URL;
    let link2Text = this.props.link2Text ? this.props.link2Text : "Uncertify";
    let link2URL;

    return (
      <div className="report-item ds-l-row">
        <div className="name ds-l-col">{this.props.year}</div>
        <div className="status ds-l-col">{this.props.status}</div>
        <div className="last-edited ds-l-col">
          {this.props.lastEditedTime}|{this.props.lastEditedDate}{" "}
        </div>
        <div className="actions ds-l-col">
          <a href={link1URL}>{link1Text}</a> |<a href={link2URL}>{link2Text}</a>
        </div>
      </div>
    );
  }
}

export default ReportItem;
