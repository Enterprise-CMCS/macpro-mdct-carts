import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { TextField } from "@cmsgov/design-system-core";
import DateComponent from "./DateComponent";

class DateRange extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.getRangeData = this.getRangeData.bind(this);
    this.validateDateRange = this.validateDateRange.bind(this);
  }

  // start 05/2019
  // end 12/2019

  // THIS STATE NEEDS TO KEEP TRACK OF THE START RANGES & END RANGES

  // check chronology
  validateDateRange() {
    // check that all 4 numbers are present
    // if start date is after end date, send dateComponent an error

    // how to ensure all four dates are there??
    if (
      this.state.monthStart &&
      this.state.monthEnd &&
      this.state.yearStart &&
      this.state.yearEnd
    ) {
      console.log("HONK HONK");
    }

    // let startDate = new Date(1995, 3);
    // console.log("date object??", startDate);
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
      <div className="date-range">
        <DateComponent
          range={true}
          getRangeData={this.getRangeData}
          validateDateRange={this.validateDateRange}
        />
        {/* <DateComponent endRange someMethod={this.method1} /> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  year: state.formYear,
});

export default connect(mapStateToProps)(DateRange);
