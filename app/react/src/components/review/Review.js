import React, { Component } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router";
import Section1 from "../sections/section1/Section1";
import Section2A from "../sections/section2a/Section2A";
import Section2B from "../sections/section2b/Section2B";
import Section3A from "../sections/section3a/Section3A";
import Section3c from "../sections/section3c/Section3C";
import Objective2b from "../sections/section2b/objectives/Objective2b";

class Review extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentState: "",
      currentYear: "",
    };
  }

  componentDidMount() {
    // Get params from URL
    const { stateAbbrev, year } = this.props.match.params;

    // Set state for current year
    this.setState(() => ({
      currentState: stateAbbrev,
      currentYear: year,
    }));
  }
  render() {
    return (
      <div className="review">
        <h1>REVIEW</h1>
        {this.state.currentState}
        {this.state.currentYear}

        {/* <Section1 /> */}
        {/* <Section2A /> */}
        {/* <Objective2b /> */}
        <Section2B />
        {/* <Section3A /> */}
        <Section3c />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.name,
});

export default connect(mapStateToProps)(Review);
