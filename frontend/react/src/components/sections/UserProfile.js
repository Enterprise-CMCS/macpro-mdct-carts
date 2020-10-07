import React, { Component } from "react";
import { connect } from "react-redux";

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
                <div>
                  {this.props.currentUser.username}
                </div>
              </div>
              <div>
                <div>Name: </div>
                <div>Full name here</div>
              </div>
              <div>
                <div>Email: </div>
                <div>
                  {this.props.currentUser.email}
                </div>
              </div>
              <div>
                <div>State: </div>
                <div>
                  {this.props.currentUser.state.name}
                </div>
              </div>
              <div>
                <div>Role: </div>
                <div>{this.props.currentUser.role}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.stateUser.currentUser,
});

export default connect(mapStateToProps)(UserProfile);
