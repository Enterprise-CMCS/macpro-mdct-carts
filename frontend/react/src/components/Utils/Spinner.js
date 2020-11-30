import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const Spinner = (props) => {
  const { isFetching, isSigningIn } = props;

  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      return (
        <div className="timer">
          <div>
            <img
              src={`${process.env.PUBLIC_URL}/img/user.gif`}
              alt="User data loaded."
              title="User data loaded."
            />
          </div>
          <div className="large-text ds-u-lg-margin-top--5">
            User data loaded!
          </div>
        </div>
      );
    }

    return (
      <div className="timer">
        <div>
          <img
            src={`${process.env.PUBLIC_URL}/img/scanner.gif`}
            alt="Loading user data."
            title="Loading user data."
          />
        </div>
        <div>
          <img
            src={`${process.env.PUBLIC_URL}/img/loading-user-data-text.gif`}
            alt="Please wait."
            title="Please wait."
          />
        </div>
        <div className="large-text ds-u-lg-margin-top--5">
          {remainingTime} seconds remaining...
        </div>
      </div>
    );
  };

  if (isSigningIn === true) {
    return (
      <div className="preloader">
        <div className="preloader-image">
          <div className="timer-wrapper">
            <CountdownCircleTimer
              isPlaying
              duration={8}
              size={440}
              colors={[["#a30000", 0.33], ["#f7b801", 0.33], ["#009500"]]}
              strokeWidth={16}
            >
              {renderTime}
            </CountdownCircleTimer>
          </div>
        </div>
      </div>
    );
  } else {
    return isFetching ? (
      <div className="preloader">
        <div className="preloader-image">
          <img
            src={`${process.env.PUBLIC_URL}/img/spinner.gif`}
            alt="Loading. Please wait."
          />
        </div>
      </div>
    ) : null;
  }
};

Spinner.propTypes = {
  isFetching: PropTypes["bool"]["isRequired"],
  isSigningIn: PropTypes["bool"]["isRequired"],
};
const mapStateToProps = (state) => {
  return {
    isFetching: state.global.isFetching,
    isSigningIn: state.global.isSigningIn,
  };
};

export default connect(mapStateToProps)(Spinner);
