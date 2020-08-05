import React, { Component } from "react";
import { TextField } from "@cmsgov/design-system-core";

class FPL extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fpl_error_fee: false,
      fpl_error_percent: false,
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
    // percentStart < percentEnd

    // Strip value of all non-numeric chars
    let numericValue = evt.target.value.replace(/\D/g, "");

    let percentBoolean = false;
    if (this.percentStart.value && this.percentEnd.value) {
      let percentStart = this.percentStart.value.replace(/,/g, "");
      let percentEnd = this.percentEnd.value.replace(/,/g, "");
      if (parseInt(percentEnd) < parseInt(percentStart)) {
        percentBoolean = true;
      }
    }

    //feeStart < feeEnd
    let feeBoolean = false;
    if (this.feeStart.value && this.feeEnd.value) {
      let feeStart = this.feeStart.value.replace(/,/g, "");
      let feeEnd = this.feeEnd.value.replace(/,/g, "");
      if (parseInt(feeEnd) < parseInt(feeStart)) {
        feeBoolean = true;
      }
    }
    this.setState({
      fpl_error_fee: feeBoolean,
      fpl_error_percent: percentBoolean,
      [`${evt.target.name}`]: numericValue,
    });
  }

  render() {
    return (
      <div className="fpl" data-test="component-FPL">
        <h3>Premium fee</h3>
        {/* <div className="ds-c-field__hint">Hint Text!</div> */}
        <div className="fpl-outer ds-l-container">
          <div className="ds-l-row fpl-percent">
            <div className="fpl-container fpl-start">
              <TextField
                className="fpl-input"
                label="FPL starts at"
                inputMode="percentage"
                pattern="[0-9]*"
                type="text"
                name="fpl_per_starts_at"
                inputRef={(percentStart) => (this.percentStart = percentStart)}
                onBlur={this.calculateFPL}
                onChange={this.changeText}
                value={this.state.fpl_per_starts_at}
              />
              <div
                className={`ds-c-field__after ds-c-field__after--percent fpl-percentage`}
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
                label="FPL ends at"
                inputMode="numeric"
                pattern="[0-9]*"
                type="text"
                name="fpl_per_ends_at"
                inputRef={(percentEnd) => (this.percentEnd = percentEnd)}
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
          {this.state.fpl_error_percent ? (
            <div className="ds-l-row fpl-error error">
              End percent cannot be lower than start percent
            </div>
          ) : null}

          <div className="ds-l-row fpl-fee">
            <div className="fpl-container fpl-start">
              <TextField
                className="fpl-input"
                label="Premium fee starts at"
                inputMode="currency"
                mask="currency"
                pattern="[0-9]*"
                type="text"
                name="fpl_fee_starts_at"
                inputRef={(feeStart) => (this.feeStart = feeStart)}
                onBlur={this.calculateFPL}
                onChange={this.changeText}
                value={this.state.fpl_fee_starts_at}
              />
            </div>
            <div className="fpl-arrow">
              <i className="fa fa-arrow-right" aria-hidden="true"></i>
            </div>
            <div className="fpl-container fpl-end">
              <TextField
                className="fpl-input"
                label="Premium fee ends at"
                inputMode="currency"
                mask="currency"
                pattern="[0-9]*"
                type="text"
                name="fpl_fee_ends_at"
                inputRef={(feeEnd) => (this.feeEnd = feeEnd)}
                onBlur={this.calculateFPL}
                onChange={this.changeText}
                value={this.state.fpl_fee_ends_at}
              />
            </div>
          </div>

          {this.state.fpl_error_fee ? (
            <div className="ds-l-row fpl-error error">
              End fee cannot be lower than start fee
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default FPL;
