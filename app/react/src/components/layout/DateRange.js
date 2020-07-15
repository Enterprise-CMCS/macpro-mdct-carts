import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { TextField } from "@cmsgov/design-system-core";
// import DateComponent from "./DateComponent";

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
    this.getRangeData = this.getRangeData.bind(this);
    this.validateDateRange = this.validateDateRange.bind(this);

    this.handleInput = this.handleInput.bind(this);

    this.validateStartInput = this.validateStartInput.bind(this);
    this.validateEndInput = this.validateEndInput.bind(this);

    this.validateMonth = this.validateMonth.bind(this);
    this.validateYear = this.validateYear.bind(this);
  }

  // This method checks that the start range is before the end range
  validateDateRange() {
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

      if (startDate > endDate) {
        chronologyError = true;
      } else {
        chronologyError = false;
      }
      this.setState({
        endRangeErr: chronologyError,
      });
    }
  }

  //This method is passed to children components to update parent state
  getRangeData(value, error, name) {
    console.log("monthstart set on parent", name);
    if (error === false) {
      this.setState({
        [name]: value,
      });
    }
  }

  validateMonth(input) {
    console.log("whats the month input??", input);
    // Handles an empty input field
    if (input === "") {
      return "Month field cannot be empty";
    }

    // Prevents users from putting in more than 2 characters
    if (input.length > 2) {
      return "Month length must be less than 2";
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

  validateYear(input) {
    // Handles an empty input field
    if (input === "") {
      return "Year field cannot be empty";
    }

    // Prevents users from putting in more than 2 characters
    if (input.length > 4) {
      // failing = true;
      return "Year length must be less than 4";
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

  handleInput(evt) {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  }

  validateEndInput() {
    let endErrorArray = [];

    endErrorArray.push(this.validateMonth(this.monthEnd.value));

    endErrorArray.push(this.validateYear(this.yearEnd.value));

    this.setState({
      endErrorMessage: endErrorArray,
    });
  }

  validateStartInput() {
    let startErrorArray = [];

    startErrorArray.push(this.validateMonth(this.monthStart.value));

    startErrorArray.push(this.validateYear(this.yearStart.value));

    this.setState({
      startErrorMessage: startErrorArray,
    });
  }

  render() {
    return (
      <Fragment>
        <div className="date-range">
          {/* <DateComponent
         
              range={"start"}
              getRangeData={this.getRangeData}
              validateDateRange={this.validateDateRange}
              endRangeErr={this.state.endRangeErr}
              previousEntry={this.props.previousEntry === true ? true : false}
            /> */}
          <div>
            {" "}
            {this.state.endRangeErr === true ? (
              <h2> Chronology is bad</h2>
            ) : null}{" "}
          </div>
          <div className="date-range-start">
            <h3 className="question-inner-header"> Start </h3>
            <div className="ds-c-field__hint"> From mm/yyyy to mm/yyyy</div>
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
                name="monthStart"
                numeric
                inputRef={(monthStart) => (this.monthStart = monthStart)}
                onChange={this.handleInput}
                onBlur={(this.validateStartInput, this.validateDateRange)}
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
                onChange={this.handleInput}
                onBlur={(this.validateStartInput, this.validateDateRange)}
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
            <h3 className="question-inner-header"> End </h3>
            <div className="ds-c-field__hint"> From mm/yyyy to mm/yyyy</div>
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
                onChange={this.handleInput}
                onBlur={(this.validateEndInput, this.validateDateRange)}
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
                onChange={this.handleInput}
                onBlur={(this.validateEndInput, this.validateDateRange)}
                numeric
                value={
                  this.props.previousEntry === true
                    ? this.state.dummyDigit * 202 - 1
                    : this.state.yearEnd
                }
              />
            </div>
          </Fragment>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  year: state.formYear,
});

export default connect(mapStateToProps)(DateRange);
