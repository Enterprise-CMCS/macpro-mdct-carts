import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class UserProfile extends Component {
  constructor() {
    super();
  }

  render() {
    const fullName =
      `${this.props.currentUser.firstname  } ${  this.props.currentUser.lastname}`;
    const {email, username, state, role} = this.props.currentUser;


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
                <div>{username}</div>
              </div>
              <div>
                <div>Name: </div>
                <div>{fullName}</div>
              </div>
              <div>
                <div>Email: </div>
                <div>{email}</div>
              </div>
              <div>
                <div>State: </div>
                <div>
                  {
                    // Check if state is an array. If so display all of them else display state object

                    Array.isArray(state) ? (
                      <ul>
                        {state.map((object) => (
                          <li>{object.name}</li>
                        ))}
                      </ul>
                    ) : (
                      state.name
                    )
                  }
                </div>
              </div>
              <div>
                <div>Role: </div>
                <div>{role || "No role available"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

UserProfile.propTypes = {
  currentUser: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  currentUser: state.stateUser.currentUser,
});

export default connect(mapStateToProps)(UserProfile);
