import React, { Component } from "react";
import { TextField } from "@cmsgov/design-system-core";

class CMSRange extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.calculateRanges = this.calculateRanges.bind(this);
  }


  calculateRanges(evt) {
    // Strip value of all non-numeric chars
    let numericValue = evt.target.value.replace(/\D/g, "");

    let willError = false;

    // If both inputs have value
    if (this.start.value && this.end.value) {
      // remove commas (added by filter)
      let start = this.start.value.replace(/,/g, "");
      let end = this.end.value.replace(/,/g, "");

      // If end is smaller than start, throw visual error
      if (parseInt(end) < parseInt(start)) {
        willError = true;
      }
    }

    this.setState({
      rangeError: willError,
      [`${evt.target.name}`]: numericValue,
    });

    this.props.onChange([`${evt.target.name}`, numericValue]);
  }

  render() {

    {/* Convert money to currency for use with CMS Design System components */ }
    let rangeType = this.props.item.answer.range_type[this.props.index] === 'money' ? 'currency' : this.props.item.answer.range_type[this.props.index];

    return (
      <div className="cmsrange">
        <div className="cmsrange-outer ds-l-container">
          <div className="ds-l-row">
            <div className="cmsrange-container range-start">
              <TextField
                className="cmsrange-input"
                label={this.props.item.answer.range_categories[this.props.index][0]}
                inputMode={this.props.item.answer.range_type[this.props.index]}
                pattern="[0-9]*"
                type="text"
                name={`range-${[this.props.counter]}-${[this.props.index]}-a`}
                inputRef={(start) => (this.start = start)}
                onChange={this.calculateRanges}
                value={this.state.rangeStartsAt}
              />
              <div
                className={"ds-c-field__after ds-c-field__after--percent cmsrange-" + rangeType}
              >
                {rangeType === "currency" ? "$" : "%"}
              </div>
            </div>
            <div className="cmsrange-arrow">
              <i className="fa fa-arrow-right" aria-hidden="true"></i>
            </div>
            <div className="cmsrange-container cmsrange-end">
              <TextField
                className="cmsrange-input"
                label={this.props.item.answer.range_categories[this.props.index][1]}
                inputMode={this.props.item.answer.range_type[this.props.index]}
                pattern="[0-9]*"
                type="text"
                name={`range-${[this.props.counter]}-${[this.props.index]}-b`}
                inputRef={(end) => (this.end = end)}
                onChange={this.calculateRanges}
                value={this.state.rangeEndsAt}
              />
              <div
                className={"ds-c-field__after ds-c-field__after--percent cmsrange-" + rangeType}
              >
                {rangeType === "currency" ? "$" : "%"}
              </div>
            </div>
          </div>
          {this.state.rangeError ? (
            <div className="ds-l-row cmsrange-error error">
              End value cannot be lower than start value
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default CMSRange;
