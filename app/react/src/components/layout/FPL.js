import React, { Component } from "react";
import { TextField, UnmaskValue } from "@cmsgov/design-system-core";

class FPL extends Component {
  render() {
    return (
      <div className="fpl">
        <h3>Premium fee</h3>
        <div className="ds-c-field__hint">Hint Text!</div>
        <div className="fpl-outer ds-l-container">
          <div className="ds-l-row">
            <div className="fpl-container fpl-start">
              <TextField
                className="fpl-input"
                label="FPL starts at"
                inputMode="percentage"
                pattern="[0-9]*"
                type="text"
                name="fpl-starts-at"
              />
              <div
                className={`ds-c-field__after ds-c-field__after--percent fpl-percentage`}
              >
                %
              </div>
            </div>
            <div className="fpl-arrow">
              <i class="fa fa-arrow-right" aria-hidden="true"></i>
            </div>
            <div className="fpl-container fpl-end">
              <TextField
                className="fpl-input"
                label="FPL ends at"
                inputMode="numeric"
                pattern="[0-9]*"
                type="text"
                name="fpl-starts-at"
              />
              <div
                className={`ds-c-field__after ds-c-field__after--percent fpl-percentage`}
              >
                %
              </div>
            </div>
          </div>

          <div className="ds-l-row">
            <div className="fpl-container fpl-start">
              <TextField
                className="fpl-input"
                label="Premium fee starts at"
                inputMode="currency"
                mask="currency"
                pattern="[0-9]*"
                type="text"
                name="fpl-starts-at"
              />
            </div>
            <div className="fpl-arrow">
              <i class="fa fa-arrow-right" aria-hidden="true"></i>
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
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FPL;
