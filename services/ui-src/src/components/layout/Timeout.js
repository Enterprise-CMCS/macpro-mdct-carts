import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Dialog } from "@cmsgov/design-system";
import { refreshCredentials, useUser } from "../../hooks/authHooks";

const Timeout = ({ showTimeout, expiresAt }) => {
  const { logout } = useUser();

  const logoutClick = () => {
    logout();
  };

  const refreshAuth = () => {
    // dispatch show timeout action
    refreshCredentials();
  };

  return (
    <>
      {showTimeout && (
        <Dialog
          isShowing={showTimeout}
          onExit={refreshCredentials}
          heading="You are about to time out."
          actions={[
            <button
              className="ds-c-button ds-u-margin-right--1"
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
          You are about to be logged out at {expiresAt}
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
