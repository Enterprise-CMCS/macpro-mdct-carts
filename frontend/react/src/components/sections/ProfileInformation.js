import React, { Component } from "react";
import { connect } from "react-redux";

class ProfileInformation extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="page-info">
        <div className="ds-l-col--12 content ds-u-padding-left--4 ">
          <h1>Profile Information</h1>
          <div className="main">
            If any information is incorrect, please contact the{" "}
            <a href="mailto:cartshelp@cms.hhs.gov">CARTS Help Desk</a>.
            <table
              className="ds-c-table-borderless ds-u-padding-top--4"
              width="100%"
            >
              <tr>
                <td>Name: </td>
                <td>Full name here</td>
              </tr>
              <tr>
                <td>Email: </td>
                <td>{this.props.currentUser.username}</td>
              </tr>
              <tr>
                <td>State: </td>
                <td>{this.props.currentUser.state.name}</td>
              </tr>
              <tr>
                <td>Role: </td>
                <td>{this.props.currentUser.role}</td>
              </tr>
              <tr>
                <td>EUA Id: </td>
                <td>{this.props.currentUser.username}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.stateUser.currentUser,
});

export default connect(mapStateToProps)(ProfileInformation);
