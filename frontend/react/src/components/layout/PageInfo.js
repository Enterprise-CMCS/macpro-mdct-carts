import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const PageInfo = ({ name }) => (
  <div className="page-info">
    <div className="edit-info">Draft | Last Edit: 4/3/20</div>
    <h1>
      {name} CARTS{} FY2020
    </h1>
  </div>
);
PageInfo.propTypes = { name: PropTypes.string.isRequired };

const mapStateToProps = (state) => ({
  name: state.stateUser.name,
});

export default connect(mapStateToProps)(PageInfo);
