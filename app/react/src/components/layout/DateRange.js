import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { TextField } from "@cmsgov/design-system-core";
import DateComponent from "./DateComponent";

class DateRange extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.getRangeData = this.getRangeData.bind(this);
    // this.validateDateRange = this.validateDateRange.bind(this);
  }

  // start 05/2019
  // end 12/2019

  // THIS STATE NEEDS TO KEEP TRACK OF THE START RANGES & END RANGES (after theyve been validated)
  // add start range and end range data to state
  // write a method that compares start range to end range
  getRangeData(value, error, name) {
    if (error === false) {
      this.setState({
        [name]: value,
      });
    }
  }

  render() {
    //needs to take in some function via this.props that will set state on parent component
    return (
      <div className="date-range ds-u-display--flex ds-u-flex-direction--row">
        <DateComponent range={true} getRangeData={this.getRangeData} />
        {/* <DateComponent endRange someMethod={this.method1} /> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  year: state.formYear,
});

export default connect(mapStateToProps)(DateRange);
