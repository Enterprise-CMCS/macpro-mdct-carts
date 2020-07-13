import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { TextField } from "@cmsgov/design-system-core";
import DateOfRangeComponent from "./DateOfRangeComponent";

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
    this.validateDateRange();
  }

  render() {
    //needs to take in some function via this.props that will set state on parent component
    return (
      <Fragment>
        <DateOfRangeComponent
          range={true}
          getRangeData={this.getRangeData}
          validateDateRange={this.validateDateRange}
          endRangeErr={this.state.endRangeErr}
          previousEntry={this.props.previousEntry === true ? true : false}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  year: state.formYear,
});

export default connect(mapStateToProps)(DateRange);
