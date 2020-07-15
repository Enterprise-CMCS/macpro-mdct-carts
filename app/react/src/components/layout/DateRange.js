import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { TextField } from "@cmsgov/design-system-core";
import DateComponent from "./DateComponent";

class DateRange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endRangeErr: false,
    };
    this.getRangeData = this.getRangeData.bind(this);
    this.validateDateRange = this.validateDateRange.bind(this);
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
    if (error === false) {
      this.setState({
        [name]: value,
      });
    }
  }

  render() {
    //needs to take in some function via this.props that will set state on parent component

    // parent component needs to keep track of all input
    // parent component knows whether its a range
    //parent component compares all 4 fields for chronology

    // date component handles input validations
    // date component  1 has a start and end
    // date component 2 has a start and end

    return (
      <Fragment>
        {this.props.previousEntry !== "xoxo" ? (
          <div className="date-range">
            <DateComponent
              startRange={"some method"}
              range={"start"}
              getRangeData={this.getRangeData}
              validateDateRange={this.validateDateRange}
              endRangeErr={this.state.endRangeErr}
              previousEntry={this.props.previousEntry === true ? true : false}
            />
            <DateComponent
              startRange={"some method"}
              range={"end"}
              getRangeData={this.getRangeData}
              validateDateRange={this.validateDateRange}
              endRangeErr={this.state.endRangeErr}
              previousEntry={this.props.previousEntry === true ? true : false}
            />
          </div>
        ) : (
          <h2> fallback </h2>
        )}

        {/* <DateComponent/> */}
        {/* <DateComponent/>
        <DateComponent/> */}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  year: state.formYear,
});

export default connect(mapStateToProps)(DateRange);
