import React, { Component } from "react";

class FillForm extends Component {
  render() {
    return (
      <div className="fill-form">
        <a
          href="javascript:void(0)"
          onClick={this.props.onClick}
          name={this.props.name}
          title={this.props.title}
          type={this.props.type}
        ></a>
      </div>
    );
  }
}

export default FillForm;
