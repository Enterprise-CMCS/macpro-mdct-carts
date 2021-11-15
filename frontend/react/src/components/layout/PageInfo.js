import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";


//Dynamically get the year of the form by referencing the path
const getYear = () => {
  let linkYear = window.location.href.toString().split("/")[6];
  return linkYear;
}

const PageInfo = ({ lastSaved, name, status, currentYear }) => (
  <div className="page-info">
    <div className="edit-info">
      {status ?? "draft"}
      {lastSaved.isValid() && ` | Last Edit: ${lastSaved.format("M/D/YYYY")}`}
    </div>
    <h1>
      {name} CARTS{} FY{getYear()}
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
