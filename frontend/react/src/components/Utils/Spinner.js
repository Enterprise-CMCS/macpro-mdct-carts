import React, { Component } from "react";
import { connect } from "react-redux";

class Spinner extends Component {
  render() {
    return this.props.isFetching ? (
      <div className="preloader">
        <div className="preloader-image">
          <img
            src={process.env.PUBLIC_URL + "/img/spinner.gif"}
            alt="Loading. Please wait."
          />
        </div>
      </div>
    ) : null;
  }
}

const mapStateToProps = (state) => {
  return {
    isFetching: state.global.isFetching,
  };
};

export default connect(mapStateToProps)(Spinner);
