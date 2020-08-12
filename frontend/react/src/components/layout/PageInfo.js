import React, { Component } from "react";
import { connect } from "react-redux";

class PageInfo extends Component {
  render() {
    return (
      <div className="page-info">
        <div className="edit-info">Draft | Last Edit: 4/3/20</div>
        <h1>
          {this.props.name} CARTS{} FY{this.props.year}
        </h1>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.stateUser.name,
  year: state.global.formYear,
});

export default connect(mapStateToProps)(PageInfo);
