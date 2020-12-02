import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { theUncertify } from "../../../actions/uncertify";
import { theAccept } from "../../../actions/accept";
import { getAllStateStatuses } from "../../../actions/initial";

const ReportItem = ({
  link1Text,
  link1URL,
  name,
  statusText,
  statusURL,
  theUncertify: uncertifyAction,
  theAccept: acceptAction,
  userRole,
}) => {
  const anchorTarget = "_self";
  const stateCode = link1URL.toString().split("/")[3];
  const uncertify = () => {
    if (window.confirm("Are you sure to uncertify this record?")) {
      uncertifyAction(stateCode);
    }
    //Getting the new statuses to update the page
    getAllStateStatuses();
  };
  const accept = () => {
    if (window.confirm("Are you sure to accept this record?")) {
      acceptAction(stateCode);
      // Need to send out a notification ticket #OY2-2416
    }
    //Getting the new statuses to update the page
    getAllStateStatuses();
  };

  return (
    <div className="report-item ds-l-row">
      <div className="name ds-l-col--2">{name}</div>
      <div
        className={`status ds-l-col--2 ${statusText === "Overdue" && `alert`}`}
      >
        {statusURL ? <a href={statusURL}> {statusText} </a> : statusText}
      </div>
      <div className="actions ds-l-col--2">
        <Link to={link1URL} target={anchorTarget}>
          {link1Text}
        </Link>
      </div>
      {(statusText === "Certified" && userRole === "co_user") ||
      userRole === "bus_user" ? (
        <div className="actions ds-l-col--2">
          <Link onClick={uncertify} variation="primary">
            Uncertify
          </Link>
        </div>
      ) : null}
      {statusText === "Certified" && userRole === "co_user" ? (
        <div className="actions ds-l-col--2">
          <Link onClick={accept} variation="primary">
            Accept
          </Link>
        </div>
      ) : null}
    </div>
  );
};

ReportItem.propTypes = {
  theUncertify: PropTypes.func.isRequired,
  theAccept: PropTypes.func.isRequired,
  link1Text: PropTypes.string,
  link1URL: PropTypes.string,
  name: PropTypes.string.isRequired,
  statusText: PropTypes.string,
  statusURL: PropTypes.string,
  userRole: PropTypes.string,
};
ReportItem.defaultProps = {
  link1Text: "View only",
  link1URL: "#",
  statusText: "Submitted",
  statusURL: "",
};

const mapState = (state) => ({
  user: state.reportStatus.userName,
});

const mapDispatch = { theUncertify, theAccept };

export default connect(mapState, mapDispatch)(ReportItem);
