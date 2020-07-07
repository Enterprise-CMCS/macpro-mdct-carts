import React, { Component, Fragment } from "react";
import { TextField } from "@cmsgov/design-system-core";
import classNames from "classnames";

class DateRange extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.validateMonth = this.validateMonth.bind(this);
  }

  validateMonth(evt) {
    let failing;
    let failMessage;
    let monthValue;
    // strip out non-numeric characters
    console.log("type??", typeof this.monthStart.value);

    if (this.monthStart.value.length > 2) {
      monthValue = this.monthStart.value.substring(2);
    } else {
      monthValue = this.monthStart.value;
    }

    if (isNaN(parseInt(monthValue)) || /^\d+$/.test(monthValue) === false) {
      failing = true;
      failMessage = "Please enter a number";
    } else if (parseInt(monthValue) < 1 || parseInt(monthValue) > 12) {
      failing = true;
      failMessage = "Please enter a valid month number";
    }

    this.setState({
      startMonthErr: failing == true ? failMessage : false,
      startMonthValue: monthValue,
    });
  }
  // Month must be maxiumum of 2 characters
  //Month must be less than 12

  //Year must be 4 characters

  render() {
    //needs to take in some function via this.props that will set state on parent component
    return (
      <div className="date-range">
        <TextField
          inputRef={(monthStart) => (this.monthStart = monthStart)}
          label="Month"
          name="month"
          onChange={this.validateMonth}
          errorMessage={this.state.startMonthErr}
          numeric
          value={this.state.startMonthValue}
        />
        <span className="ds-c-datefield__separator">/</span>
        <TextField
          label="Year"
          name="year"
          inputRef={(yearStart) => (this.yearStart = yearStart)}
          numeric
        />
      </div>
    );
  }
}

export default DateRange;
