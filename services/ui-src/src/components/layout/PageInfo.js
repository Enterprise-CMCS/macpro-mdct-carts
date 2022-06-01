import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
import Title from "./Title";

const PageInfo = ({ lastSaved, status }) => (
  <div className="page-info">
    <div className="edit-info no-print">
      {status ?? "draft"}
      {lastSaved.isValid() && ` | Last Edit: ${lastSaved.format("M/D/YYYY")}`}
    </div>
    <Title />
  </div>
);
PageInfo.propTypes = {
  lastSaved: PropTypes.object.isRequired,
  status: PropTypes.string,
};

const mapStateToProps = (state) => ({
  lastSaved: moment(state.save.lastSave),
  status: state.reportStatus.status,
});

export default connect(mapStateToProps)(PageInfo);
