import React, { Component } from "react";
import { TextField } from "@cmsgov/design-system-core";
import CMSLegend from "../fields/CMSLegend";

class CMSRange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fpl_error_fee: false,
      fpl_error: false,
      fpl_fee_start: null,
      fpl_fee_end: null,
      fpl_percent_start: null,
      fpl_percent_end: null,
      fpl_per_starts_at: null,
      fpl_per_ends_at: null,
      fpl_fee_starts_at: null,
      fpl_fee_ends_at: null,
    };
    this.calculateFPL = this.calculateFPL.bind(this);
    this.changeText = this.changeText.bind(this);
  }

  // Allows updating text when value is set to state
  changeText(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  calculateFPL(evt) {
    // Strip value of all non-numeric chars
    let numericValue = evt.target.value.replace(/\D/g, "");

    let willError = false;
    if (this.start.value && this.end.value) {
      let start = this.start.value.replace(/,/g, "");
      let end = this.end.value.replace(/,/g, "");
      if (parseInt(end) < parseInt(start)) {
        willError = true;
      }
    }

    this.setState({
      fpl_error: willError,
      [`${evt.target.name}`]: numericValue,
    });
  }

  render() {
    return (
      <div className="cmsrange">
        <CMSLegend
          label={this.props.item.label}
          type="subquestion"
          id={this.props.item.id}
        />

        <div className="cmsrange-outer ds-l-container">
          <div className="ds-l-row">
            <div className="fpl-container range-start">
              <TextField
                className="fpl-input"
                label={this.props.item.answer.range_categories[0][0]}
                inputMode="percentage"
                pattern="[0-9]*"
                type="text"
                name="range-start"
                inputRef={(start) => (this.start = start)}
                onBlur={this.calculateFPL}
                onChange={this.changeText}
                value={this.state.fpl_per_starts_at}
              />
              <div
                className={`ds-c-field__after ds-c-field__after--percent cmsrange-percentage`}
              >
                %
              </div>
            </div>
            <div className="fpl-arrow">
              <i className="fa fa-arrow-right" aria-hidden="true"></i>
            </div>
            <div className="fpl-container fpl-end">
              <TextField
                className="fpl-input"
                label={this.props.item.answer.range_categories[0][1]}
                inputMode="numeric"
                pattern="[0-9]*"
                type="text"
                name="fpl_per_ends_at"
                inputRef={(end) => (this.end = end)}
                onBlur={this.calculateFPL}
                onChange={this.changeText}
                value={this.state.fpl_per_ends_at}
              />
              <div
                className={`ds-c-field__after ds-c-field__after--percent fpl-percentage`}
              >
                %
              </div>
            </div>
          </div>
          {this.state.fpl_error ? (
            <div className="ds-l-row fpl-error error">
              End percent cannot be lower than start percent
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default CMSRange;
