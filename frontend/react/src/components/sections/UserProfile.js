import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const UserProfile = ({ currentUser }) => {
  return (
    <div className="page-info">
      <div className="ds-l-col--12 content ds-u-padding-left--4 ">
        <h1>User Profile</h1>
        <div className="main">
          If any information is incorrect, please contact the{" "}
          <a href="mailto:cartshelp@cms.hhs.gov">CARTS Help Desk</a>.
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
        </div>
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
