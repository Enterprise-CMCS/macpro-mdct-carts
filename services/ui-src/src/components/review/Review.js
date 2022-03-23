import React, { Component } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router";
import Section1Review from "./Section1Review";
import Section2AReview from "./Section2AReview";
import Section2BReview from "./Section2BReview";
import Section3AReview from "./Section3AReview";
import Section3CReview from "./Section3CReview";

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
        <Section2BReview />
        <Section3AReview />
        <Section3CReview />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.name,
});

export default connect(mapStateToProps)(Review);
