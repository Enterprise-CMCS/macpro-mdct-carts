import React, { Component } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router";
import Section1Review from "./Section1Review";
import Section2AReview from "./Section2AReview";
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
      <div className="review-view">
        <Section1Review />
        <Section2AReview />
        {/* <Section2B review /> */}
        {/* <Section3A /> */}
        {/* <Section3c review /> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.name,
});

export default connect(mapStateToProps)(Review);
