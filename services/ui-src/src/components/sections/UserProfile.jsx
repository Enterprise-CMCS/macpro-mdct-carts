import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const UserProfile = ({ currentUser }) => {
  return (
    <div className="page-info ds-l-container">
      <div className="ds-l-col--12">
        <header>
          <h1>User Profile</h1>
        </header>
        <main className="main">
          If any information is incorrect, please contact the{" "}
          <a href="mailto:mdct_help@cms.hhs.gov">mdct_help@cms.hhs.gov</a>.
          <div className="profile-information">
            <div>
              <div>EUA Id: </div>
              <div>{currentUser.username}</div>
            </div>
            <div>
              <div>Name: </div>
              <div>
                {currentUser.firstname} {currentUser.lastname}
              </div>
            </div>
            <div>
              <div>Email: </div>
              <div>{currentUser.email}</div>
            </div>
            <div>
              <div>Role: </div>
              <div>{currentUser.role}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

UserProfile.propTypes = {
  currentUser: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  currentUser: state.stateUser.currentUser,
});

export default connect(mapStateToProps)(UserProfile);
