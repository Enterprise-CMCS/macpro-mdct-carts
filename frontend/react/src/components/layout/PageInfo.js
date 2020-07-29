import React, { Component } from "react";
import { connect } from "react-redux";

class PageInfo extends Component {
  render() {
    return (
      <div className="page-info">
        <div className="edit-info">Draft | Last Edit: 4/3/20</div>
        <h1>
          {this.props.name} CARTS{} FY2020
        </h1>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.stateUser.name,
});

export default connect(mapStateToProps)(PageInfo);
