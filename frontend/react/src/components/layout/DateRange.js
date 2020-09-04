import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { TextField } from "@cmsgov/design-system-core";
import PropTypes from "prop-types";

class DateRange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endRangeErr: false,
      monthStart: "",
      yearStart: "",
      monthEnd: "",
      yearEnd: "",
      startErrorMessage: [],
      endErrorMessage: [],
      dummyDigit: 10,
    };
    this.handleInput = this.handleInput.bind(this);

    this.checkChronology = this.checkChronology.bind(this);

    this.validateStartInput = this.validateStartInput.bind(this);
    this.validateEndInput = this.validateEndInput.bind(this);

    this.validateMonth = this.validateMonth.bind(this);
    this.validateYear = this.validateYear.bind(this);
  }

  // This method checks all 4 fields to confirm that the start range is before the end range
  checkChronology() {
    let chronologyError;

    // Ensure that all 4 fields are filled in
    if (
      this.state.monthStart &&
      this.state.monthEnd &&
      this.state.yearStart &&
      this.state.yearEnd
    ) {
      const { monthStart, monthEnd, yearStart, yearEnd } = this.state;

      // Turn the input into date objects for easy comparison
      let startDate = new Date(yearStart, monthStart - 1);
      let endDate = new Date(yearEnd, monthEnd - 1);

      // The entry value for daterange must be sent to the server as an array of two strings
      // The format must be an ISO 8601 Date format.
      //Because we are only asking for month/year, the last digit is a placeholder of '01'
      let payload = [
        `${yearStart}-${monthStart}-01`,
        `${yearEnd}-${monthEnd}-01`,
      ];

      if (startDate > endDate) {
        chronologyError = true;
      } else {
        chronologyError = false;
        this.props.onChange([this.props.question.id, payload]);
      }

      this.setState({
        endRangeErr: chronologyError,
      });
    }
  }

  // This method checks that month input is appropriate
  // (not empty, max of 2 digits, no letters, between 1 & 12)
  validateMonth(input) {
    // Handles an empty input field
    if (input === "") {
      return "Month field cannot be empty";
    }

    // Prevents users from putting in more than 2 characters
    if (input.length > 2) {
      return "Month length must not exceed 2";
    }

    // Checks for non-numeric characters
    if (isNaN(parseInt(input)) || /^\d+$/.test(input) === false) {
      return "Please enter a number";
    }

    if (parseInt(input) < 1 || parseInt(input) > 12) {
      // Checks that the month value is within a normal range
      return "Please enter a valid month number";
    }
  }

  // This method checks that year input is appropriate
  //(not empty, max of 4 digits, no letters, reasonable year)
  validateYear(input) {
    // Handles an empty input field
    if (input === "") {
      return "Year field cannot be empty";
    }

    // Prevents users from putting in more than 2 characters
    if (input.length > 4) {
      // failing = true;
      return "Year length must not exceed 4";
    }

    if (
      // Checks for non-numeric characters
      isNaN(parseInt(input)) ||
      /^\d+$/.test(input) === false
    ) {
      // failing = true;
      return "Please enter a number";
    } else if (
      parseInt(input) < 1776 ||
      parseInt(input) > parseInt(this.props.year)
    ) {
      // Checks that the month value is within a normal range
      return "Please enter a valid Year";
    }
  }

  // This method checks the first month/year input range and sets any validation errors to state
  validateStartInput() {
    let startErrorArray = [];

    startErrorArray.push(this.validateMonth(this.monthStart.value));
    startErrorArray.push(this.validateYear(this.yearStart.value));

    this.setState({
      startErrorMessage: startErrorArray,
    });

    this.checkChronology();
  }

  // This method checks the second month/year input range and sets any validation errors to state
  validateEndInput() {
    let endErrorArray = [];

    endErrorArray.push(this.validateMonth(this.monthEnd.value));
    endErrorArray.push(this.validateYear(this.yearEnd.value));

    this.setState({
      endErrorMessage: endErrorArray,
    });

    this.checkChronology();
  }

  // This method takes all user input and sets it to state
  handleInput(evt) {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  }

  sendToParent() {
    // check that all four values are present
    // if they are, send them to parent state
  }

  render() {
    return (
      <Fragment>
        <div className="date-range" data-test="component-date-range">
          <div className="date-range-start">
            <h3 className="question-inner-header">
              {" "}
              {this.props.question.answer.labels[0]
                ? this.props.question.answer.labels[0]
                : "Start"}{" "}
            </h3>
            <div className="ds-c-field__hint"> mm/yyyy</div>
            <div className="errors">
              {this.state.startErrorMessage.map((e, idx) => {
                if (e !== undefined) {
                  return <div key={idx}> {e} </div>;
                }
              })}
            </div>
            <div className="date-range-start-wrapper">
              <TextField
                className="ds-c-field--small"
                data-test="component-daterange-monthstart"
                name="monthStart"
                numeric
                label={""}
                inputRef={(monthStart) => (this.monthStart = monthStart)}
                onChange={this.handleInput}
                onBlur={this.validateStartInput}
                value={
                  this.props.previousEntry === true
                    ? this.state.dummyDigit - 5
                    : this.state.monthStart
                }
              />
              <div className="ds-c-datefield__separator">/</div>
              <TextField
                className="ds-c-field--small"
                inputRef={(yearStart) => (this.yearStart = yearStart)}
                name="yearStart"
                label={""}
                onChange={this.handleInput}
                onBlur={this.validateStartInput}
                numeric
                value={
                  this.props.previousEntry === true
                    ? this.state.dummyDigit * 202 - 1
                    : this.state.yearStart
                }
              />
            </div>
          </div>

          <Fragment>
            <h3 className="question-inner-header">
              {" "}
              {this.props.question.answer.labels[1]
                ? this.props.question.answer.labels[1]
                : "End"}{" "}
            </h3>
            <div className="ds-c-field__hint"> mm/yyyy</div>
            <div className="errors">
              {this.state.endErrorMessage.map((e, idx) => {
                if (e !== undefined) {
                  return <div key={idx}> {e} </div>;
                }
              })}
            </div>

            <div className="date-range-end-wrapper">
              <TextField
                className="ds-c-field--small"
                inputRef={(monthEnd) => (this.monthEnd = monthEnd)}
                name="monthEnd"
                numeric
                label={""}
                onChange={this.handleInput}
                onBlur={this.validateEndInput}
                value={
                  this.props.previousEntry === true
                    ? this.state.dummyDigit
                    : this.state.monthEnd
                }
              />
              <div className="ds-c-datefield__separator">/</div>

              <TextField
                className="ds-c-field--small"
                inputRef={(yearEnd) => (this.yearEnd = yearEnd)}
                name="yearEnd"
                label={""}
                onChange={this.handleInput}
                onBlur={this.validateEndInput}
                numeric
                value={
                  this.props.previousEntry === true
                    ? this.state.dummyDigit * 202
                    : this.state.yearEnd
                }
              />
            </div>
            <div className="errors">
              {this.state.endRangeErr === true ? (
                <div> End date must come after start date</div>
              ) : null}
            </div>
          </Fragment>
        </div>
      </Fragment>
    );
  }
}

DateRange.propTypes = {
  previousEntry: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  year: state.stateUser.formYear,
});

export default connect(mapStateToProps)(DateRange);
