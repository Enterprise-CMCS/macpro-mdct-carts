import React, { Component } from "react";

class ReportItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let link1Text;
    let link1URL;
    let link2Text;
    let link2URL;

    if (this.props.current === false) {
      // need download, uncertify
    } else {
      // need edit link, need download link
      actions = '<a href="/preamble">Edit</a> | <a href="#">Download</a>';
    }

    return (
      <div className="report-item ds-l-row">
        <div className="name ds-l-col">{this.props.year}</div>
        <div className="status ds-l-col">{this.props.status}</div>
        <div className="last-edited ds-l-col">
          {this.props.lastEditedTime}|{this.props.lastEditedDate}{" "}
        </div>
        <div className="actions ds-l-col">
          {<a href={link1URL}>{link1Text}</a> |
          <a href={link2URL}>{link2Text}</a>}

          {this.props.propInQuestion ? <a href="#">link</a> : null}
        </div>
      </div>
    );
  }
}

export default ReportItem;
