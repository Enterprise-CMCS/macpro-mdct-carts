import React, { Component } from "react";
import { TextField, UnmaskValue } from "@cmsgov/design-system-core";

class FPL extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fpl_error_fee: false,
      fpl_error_percent: false,
    };
    this.calculateFPL = this.calculateFPL.bind(this);
  }

  calculateFPL(evt) {
    // percentStart < percentEnd

    console.log("start???", this.percentStart);
    let percent = false;
    if (this.percentStart && this.percentEnd) {
      if (this.percentEnd < this.percentStart) {
        percent = true;
      }
    }

    //feeStart < feeEnd
    let fee = false;
    if (this.feeStart && this.feeEnd) {
      if (this.feeEnd < this.feeStart) {
        fee = true;
      }
    }
    this.setState({
      fpl_error_fee: fee,
      fpl_error_percent: percent,
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
                ref={(percentStart) => (this.percentStart = percentStart)}
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
                ref={(percentEnd) => (this.percentEnd = percentEnd)}
                onBlur={this.calculateFPL}
              />
              <div
                className={`ds-c-field__after ds-c-field__after--percent fpl-percentage`}
              >
                %
              </div>
            </div>
            {this.state.fpl_error_percent ? (
              <div> Your percents are wrong</div>
            ) : null}
          </div>

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
                ref={(feeStart) => (this.feeStart = feeStart)}
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
                ref={(feeEnd) => (this.feeEnd = feeEnd)}
                onBlur={this.calculateFPL}
              />
            </div>
            {this.state.fpl_error_fee ? <div> Your fees are wrong</div> : null}
          </div>
        </div>
      </div>
    );
  }
}

export default FPL;
