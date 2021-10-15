import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";

const PageInfo = ({ lastSaved, name, status, currentYear }) => (
  <div className="page-info">
    <div className="edit-info">
      {status ?? "draft"}
      {lastSaved.isValid() && ` | Last Edit: ${lastSaved.format("M/D/YYYY")}`}
    </div>
    <h1>
      {name} CARTS{} FY{currentYear}
    </h1>
  </div>
);
PageInfo.propTypes = {
  lastSaved: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  currentYear: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  name: state.stateUser.name,
  lastSaved: moment(state.save.lastSave),
  status: state.reportStatus.status,
  currentYear: state.global.currentYear,
});

export default connect(mapStateToProps)(PageInfo);
