import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Dialog } from "@cmsgov/design-system";
import { refreshCredentials, useUser } from "../../hooks/authHooks";
import moment from "moment";

const calculateTimeLeft = (expiresAt) => {
  return expiresAt.diff(moment()) / 1000;
};

const Timeout = ({ showTimeout, expiresAt }) => {
  const { logout } = useUser();
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(expiresAt));

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(expiresAt));
    }, 500);
  });

  const logoutClick = () => {
    logout();
  };
  const refreshAuth = async () => {
    await refreshCredentials();
  };

  const expired = expiresAt.isBefore();
  const body = expired
    ? "You have been logged out due to inactivity. Please log in again."
    : `You will be logged out in ${Math.floor(timeLeft)} seconds.`;

  return (
    <>
      {showTimeout && (
        <Dialog
          isShowing={showTimeout}
          onExit={refreshAuth}
          heading="You are about to time out."
          actions={[
            <button
              className="ds-c-button ds-u-margin-right--1"
              disabled={expired}
              key="Stay Logged In"
              aria-label="Stay Logged In"
              onClick={refreshAuth}
            >
              Stay Logged In
            </button>,
            <button
              className="ds-c-button ds-c-button--primary ds-u-margin-right--1"
              key="Log Out"
              aria-label="Log out"
              onClick={logoutClick}
            >
              Log Out
            </button>,
          ]}
        >
          {body}
        </Dialog>
      )}
    </>
  );
};

Timeout.propTypes = {
  showTimeout: PropTypes.bool.isRequired,
  expiresAt: PropTypes.any.isRequired,
};

const mapState = (state) => ({
  showTimeout: state.stateUser.showTimeout,
  expiresAt: state.stateUser.expiresAt,
});

export default connect(mapState)(Timeout);
