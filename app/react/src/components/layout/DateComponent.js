import React, { Component, Fragment } from "react";
import { TextField } from "@cmsgov/design-system-core";
import { connect } from "react-redux";

// Custom date component similar to the CMS DateField component.
// This custom component allows for the omission of the 'month' field
class DateComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startYearErr: false,
      startYearValue: "",
      startMonthErr: false,
      startMonthValue: "",
    };
    this.validateMonth = this.validateMonth.bind(this);
    this.validateYear = this.validateYear.bind(this);
  }

  validateYear(evt) {
    console.log(this.yearStart.value);
    let failing;
    let failMessage;
    let yearValue;

    // Prevents users from putting in more than 4 characters
    if (this.yearStart.value.length > 4) {
      yearValue = this.yearStart.value.substring(4);
    } else {
      yearValue = this.yearStart.value;
    }

    // Checks for non-numeric characters
    if (isNaN(parseInt(yearValue)) || /^\d+$/.test(yearValue) === false) {
      failing = true;
      failMessage = "Please enter a number";
    } else if (
      parseInt(yearValue) < 1950 ||
      parseInt(yearValue) > parseInt(this.props.year)
    ) {
      failing = true;
      failMessage = "Please enter a valid year";
    }

    this.setState({
      startYearErr: failing == true ? failMessage : false,
      startYearValue: yearValue,
    });
  }

  validateMonth(evt) {
    let failing;
    let failMessage;
    let monthValue;
    // console.log("type??", typeof this.monthStart.value);

    // Prevents users from putting in more than 2 characters
    if (this.monthStart.value.length > 2) {
      monthValue = this.monthStart.value.substring(2);
    } else {
      monthValue = this.monthStart.value;
    }

    // Checks for non-numeric characters
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

  render() {
    // console.log("start or end??", this.props.startRange);

    // a method passed down via props will update the daterange state

    return (
      <Fragment>
        {/* {this.props.someMethod("Blue")} */}
        {this.props.startRange ? (
          <Fragment>
            <TextField
              className="ds-u-padding--1 ds-u-margin--1"
              errorMessage={this.state.startMonthErr}
              inputRef={(monthStart) => (this.monthStart = monthStart)}
              label="Month"
              name="month"
              numeric
              onChange={this.validateMonth}
              onBlur={this.props.someMethod(
                this.state.startMonthValue,
                this.state.startMonthErr,
                "startMonthValue"
              )}
              value={this.state.startMonthValue}
            />
            <span className="ds-c-datefield__separator">/</span>
            <TextField
              className="ds-u-padding--1 ds-u-margin--1"
              errorMessage={this.state.startYearErr}
              inputRef={(yearStart) => (this.yearStart = yearStart)}
              label="Year"
              name="year"
              onChange={this.validateYear}
              //   onBlur={this.props.someMethod(this.state.startYearValue)}
              numeric
              value={this.state.startYearValue}
            />
          </Fragment>
        ) : null}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  year: state.formYear,
});

export default connect(mapStateToProps)(DateComponent);
