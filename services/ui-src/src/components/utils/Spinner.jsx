import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { BASE_URL } from "../../util/constants";

const Spinner = (props) => {
  const { isFetching } = props;

  return isFetching ? (
    <div className="preloader">
      <div className="preloader-image">
        <img
          data-testid="spinner-img"
          src={`${BASE_URL}/img/spinner.gif`}
          alt="Loading. Please wait."
        />
      </div>
    </div>
  ) : null;
};

Spinner.propTypes = {
  isFetching: PropTypes.bool.isRequired,
};
const mapStateToProps = (state) => {
  return {
    isFetching: state.global.isFetching,
  };
};

export default connect(mapStateToProps)(Spinner);
