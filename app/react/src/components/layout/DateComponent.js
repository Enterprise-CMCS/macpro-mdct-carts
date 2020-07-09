import React, { Component, Fragment } from "react";
import { TextField } from "@cmsgov/design-system-core";
import { connect } from "react-redux";

// Custom date component similar to the CMS DateField component.
// This custom component allows for the omission of the 'month' field
class DateComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      monthStartErr: false,
      monthStart: "",

      yearStartErr: false,
      yearStart: "",

      monthEndErr: false,
      monthEnd: "",

      yearEndErr: false,
      yearEnd: "",
    };
    this.validateMonth = this.validateMonth.bind(this);
    this.validateYear = this.validateYear.bind(this);
  }

  validateYear(evt) {
    let failing;
    let failMessage;
    let yearValue;

    // Prevents users from putting in more than 4 characters
    if (evt.target.value.length > 4) {
      yearValue = evt.target.value.substring(4);
    } else {
      yearValue = evt.target.value;
    }

    // Handles an empty input field
    if (yearValue === "") {
      failing = true;
      failMessage = false;
    } else if (
      // Checks for non-numeric characters
      isNaN(parseInt(yearValue)) ||
      /^\d+$/.test(yearValue) === false
    ) {
      failing = true;
      failMessage = "Please enter a number";
    } else if (
      // Checks that the year is within an appropriate range
      parseInt(yearValue) < 1776 ||
      parseInt(yearValue) > parseInt(this.props.year)
    ) {
      failing = true;
      failMessage = "Please enter a valid year";
    }

    this.setState({
      [`${evt.target.name}Err`]: failing == true ? failMessage : false,
      [evt.target.name]: yearValue,
    });
  }

  validateMonth(evt) {
    let failing;
    let failMessage;
    let monthValue;

    // Prevents users from putting in more than 2 characters
    if (evt.target.value.length > 2) {
      monthValue = evt.target.value.substring(2);
    } else {
      monthValue = evt.target.value;
    }

    // Handles an empty input field
    if (monthValue === "") {
      failing = true;
      failMessage = false;
    } else if (
      // Checks for non-numeric characters
      isNaN(parseInt(monthValue)) ||
      /^\d+$/.test(monthValue) === false
    ) {
      failing = true;
      failMessage = "Please enter a number";
    } else if (parseInt(monthValue) < 1 || parseInt(monthValue) > 12) {
      // Checks that the month value is within a normal range
      failing = true;
      failMessage = "Please enter a valid month number";
    }

    this.setState({
      [`${evt.target.name}Err`]: failing == true ? failMessage : false,
      [evt.target.name]: monthValue,
    });
  }

  render() {
    // console.log("start or end??", this.props.startRange);

    // a method passed down via props will update the daterange state

    return (
      <Fragment>
        {this.props.range ? (
          <div className="date-range">
            <div className="date-range-start">
              <TextField
                className="ds-u-padding--1 ds-u-margin--1"
                errorMessage={this.state.monthStartErr}
                inputRef={(monthStart) => (this.monthStart = monthStart)}
                label="Month"
                name="monthStart"
                numeric
                onChange={this.validateMonth}
                onBlur={
                  (this.props.getRangeData(
                    this.state.monthStart,
                    this.state.monthStartErr,
                    "monthStart"
                  ),
                  this.props.validateDateRange)
                }
                value={this.state.monthStart}
              />
              <span className="ds-c-datefield__separator">/</span>
              <TextField
                className="ds-u-padding--1 ds-u-margin--1"
                errorMessage={this.state.yearStartErr}
                inputRef={(yearStart) => (this.yearStart = yearStart)}
                label="Year"
                name="yearStart"
                onChange={this.validateYear}
                onBlur={
                  (this.props.getRangeData(
                    this.state.yearStart,
                    this.state.yearStartErr,
                    "yearStart"
                  ),
                  this.props.validateDateRange)
                }
                numeric
                value={this.state.yearStart}
              />
            </div>

            <div className="date-range-end">
              <TextField
                className="ds-u-padding--1 ds-u-margin--1"
                errorMessage={this.state.monthEndErr}
                inputRef={(monthEnd) => (this.monthEnd = monthEnd)}
                label="Month"
                name="monthEnd"
                numeric
                onChange={this.validateMonth}
                onBlur={
                  (this.props.getRangeData(
                    this.state.monthEnd,
                    this.state.monthEndErr,
                    "monthEnd"
                  ),
                  this.props.validateDateRange)
                }
                value={this.state.monthEnd}
              />
              <span className="ds-c-datefield__separator">/</span>
              <TextField
                className="ds-u-padding--1 ds-u-margin--1"
                errorMessage={this.state.yearEndErr}
                inputRef={(yearEnd) => (this.yearEnd = yearEnd)}
                label="Year"
                name="yearEnd"
                onChange={this.validateYear}
                onBlur={
                  (this.props.getRangeData(
                    this.state.yearEnd,
                    this.state.yearEndErr,
                    "yearEnd"
                  ),
                  this.props.validateDateRange)
                }
                numeric
                value={this.state.yearEnd}
              />
            </div>
          </div>
        ) : null}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  year: state.formYear,
});

export default connect(mapStateToProps)(DateComponent);
