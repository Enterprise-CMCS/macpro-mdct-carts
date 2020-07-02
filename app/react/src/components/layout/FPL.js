import React, { Component } from "react";
import { TextField, UnmaskValue } from "@cmsgov/design-system-core";

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
    };
    this.calculateFPL = this.calculateFPL.bind(this);
  }

  calculateFPL(evt) {
    // percentStart < percentEnd

    console.log("FEE start???", this.feeStart.value);
    let percentBoolean = false;
    if (this.percentStart.value && this.percentEnd.value) {
      if (parseInt(this.percentEnd.value) < parseInt(this.percentStart.value)) {
        percentBoolean = true;
      }
    }

    //feeStart < feeEnd
    let feeBoolean = false;
    if (this.feeStart.value && this.feeEnd.value) {
      if (parseInt(this.feeEnd.value) < parseInt(this.feeStart.value)) {
        feeBoolean = true;
      }
    }
    this.setState({
      fpl_error_fee: feeBoolean,
      fpl_error_percent: percentBoolean,
    });
  }

  render() {
    return (
      <div className="fpl">
        <h3>Premium fee</h3>
        <div className="ds-c-field__hint">Hint Text!</div>
        <div className="fpl-outer ds-l-container">
          <div className="ds-l-row fpl-percent">
            <div className="fpl-container fpl-start">
              <TextField
                className="fpl-input"
                label="FPL starts at"
                inputMode="percentage"
                pattern="[0-9]*"
                type="text"
                name="fpl-starts-at"
                inputRef={(percentStart) => (this.percentStart = percentStart)}
                onBlur={this.calculateFPL}
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
                name="fpl-starts-at"
                inputRef={(percentEnd) => (this.percentEnd = percentEnd)}
                onBlur={this.calculateFPL}
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
                name="fpl-starts-at"
                inputRef={(feeStart) => (this.feeStart = feeStart)}
                onBlur={this.calculateFPL}
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
                name="fpl-starts-at"
                inputRef={(feeEnd) => (this.feeEnd = feeEnd)}
                onBlur={this.calculateFPL}
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
