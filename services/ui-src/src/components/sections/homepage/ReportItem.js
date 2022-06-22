import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { theUncertify } from "../../../actions/uncertify";
import { UserRoles } from "../../../types";
import { Dialog } from "@cmsgov/design-system";
import useModal from "../../../hooks/useModal";

const ReportItem = ({
  link1Text,
  link1URL,
  name,
  statusText,
  statusURL,
  theUncertify: uncertifyAction,
  userRole,
  year,
  username,
  lastChanged,
}) => {
  const anchorTarget = "_self";
  const stateCode = link1URL.toString().split("/")[3];
  const stateYear = link1URL.toString().split("/")[4];
  const { isShowing, toggleModal } = useModal();
  let lastEditedNote = "";
  let stateUser = false;
  if (userRole === UserRoles.STATE) {
    stateUser = true;
  }

  if (lastChanged) {
    let date = new Date(lastChanged);
    let time = new Intl.DateTimeFormat("default", {
      hour12: true,
      hour: "numeric",
      minute: "numeric",
    }).format(date);
    lastEditedNote = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()} at ${time}`;
    if (username) {
      lastEditedNote += ` by ${username}`;
    }
  }

  const uncertify = () => {
    uncertifyAction(stateCode, stateYear);
    toggleModal();
    window.location.reload(false);
  };

  return (
    <>
      {!stateUser && (
        <div className="report-item ds-l-row">
          <div className="name ds-l-col--1">{year}</div>
          <div className="name ds-l-col--2">{name}</div>
          <div
            className={`status ds-l-col--2 ${
              statusText === "Overdue" && `alert`
            }`}
          >
            {statusURL ? <a href={statusURL}> {statusText} </a> : statusText}
          </div>
          <div className="actions ds-l-col--3">{lastEditedNote}</div>
          <div className="actions ds-l-col--auto">
            <Link to={link1URL} target={anchorTarget}>
              {link1Text}
            </Link>
          </div>
          {statusText === "Certified and Submitted" &&
          userRole === UserRoles.APPROVER ? (
            <div className="actions ds-l-col--auto">
              <button className="link" onClick={toggleModal}>
                Uncertify
              </button>
            </div>
          ) : null}
          {isShowing && (
            <Dialog
              isShowing={isShowing}
              onExit={toggleModal}
              heading="Uncertify this Report?"
              actions={[
                <button
                  className="ds-c-button ds-c-button--primary ds-u-margin-right--1"
                  key="primary"
                  onClick={uncertify}
                  aria-label="Uncertify this Report"
                >
                  Yes, Uncertify
                </button>,
              ]}
            >
              Uncertifying will send this CARTS report back to the state user
              who submitted it
            </Dialog>
          )}
        </div>
      )}
      {stateUser && (
        <div className="report-item ds-l-row">
          <div className="name ds-l-col--2">{name}</div>
          <div
            className={`status ds-l-col--2 ${
              statusText === "Overdue" && `alert`
            }`}
          >
            {statusURL ? <a href={statusURL}> {statusText} </a> : statusText}
          </div>
          <div className="actions ds-l-col--3">{lastEditedNote}</div>
          <div className="actions ds-l-col--1">
            <Link to={link1URL} target={anchorTarget}>
              {link1Text}
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

ReportItem.propTypes = {
  theUncertify: PropTypes.func.isRequired,
  link1Text: PropTypes.string,
  link1URL: PropTypes.string,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  statusText: PropTypes.string,
  statusURL: PropTypes.string,
  userRole: PropTypes.string,
  year: PropTypes.number.isRequired,
  username: PropTypes.string,
  lastChanged: PropTypes.string,
};
ReportItem.defaultProps = {
  link1Text: "View",
  link1URL: "#",
  statusText: "Missing Status",
  statusURL: "",
};

const mapState = (state) => ({
  user: state.reportStatus.username,
});

const mapDispatch = { theUncertify };

export default connect(mapState, mapDispatch)(ReportItem);
