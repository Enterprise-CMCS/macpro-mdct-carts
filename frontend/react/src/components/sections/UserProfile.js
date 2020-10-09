import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Profile from "../../Profile";

class UserProfile extends Component {
  constructor() {
    super();
  }

  render() {
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
                <div>{this.props.currentUser.username}</div>
              </div>
              <div>
                <div>Name: </div>
                <div>
                  {this.props.currentUser.firstname +
                    " " +
                    this.props.currentUser.lastname}
                </div>
              </div>
              <div>
                <div>Email: </div>
                <div>{this.props.currentUser.email}</div>
              </div>
              <div>
                <div>State: </div>
                <div>
                  {
                    // Check if state is an array. If so display all of them else display state object
                    this.props.currentUser.state ? (
                      Array.isArray(this.props.currentUser.state) ? (
                        <ul>
                          {this.props.currentUser.state.map((state) => (
                            <li>{state.name}</li>
                          ))}
                        </ul>
                      ) : (
                        this.props.currentUser.state.name
                      )
                    ) : (
                      "No state available"
                    )
                  }
                </div>
              </div>
              <div>
                <div>Role: </div>
                <div>
                  {this.props.currentUser.role
                    ? this.props.currentUser.role
                    : "No role available"}
                </div>
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
