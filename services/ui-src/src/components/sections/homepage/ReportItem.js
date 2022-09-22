import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { theUncertify } from "../../../actions/uncertify";
import { AppRoles } from "../../../types";
import { Dialog } from "@cmsgov/design-system";
import useModal from "../../../hooks/useModal";

const ReportItem = ({
  link1Text,
  link1URL,
  name,
  statusText,
  theUncertify: uncertifyAction,
  userRole,
  year,
  username,
  lastChanged,
  timeZone,
}) => {
  const anchorTarget = "_self";
  const stateCode = link1URL.toString().split("/")[3];
  const stateYear = link1URL.toString().split("/")[4];
  const { isShowing, toggleModal } = useModal();
  let lastEditedNote = "";
  let stateUser = userRole === AppRoles.STATE_USER;

  if (lastChanged) {
    const date = new Date(lastChanged);
    // Using en-CA as they format the date to YYYY-MM-DD, HH:MM:SS where as en-US formats to DD/MM/YYYY, HH:MM:SS
    const time = new Intl.DateTimeFormat("en-CA", {
      hour12: true,
      second: "numeric",
      hour: "numeric",
      minute: "numeric",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone,
    }).format(date);
    const splitTime = time.split(",");
    lastEditedNote = splitTime?.[1]
      ? `${splitTime[0]} at ${splitTime[1].trim()}`
      : `${splitTime[0]}`;
    lastEditedNote += username ? ` by ${username}` : "";
  }

  const uncertify = async () => {
    await uncertifyAction(stateCode, stateYear);
    toggleModal();
    window.location.reload(false);
  };

  return (
    <>
      {!stateUser && (
        <div className="report-item ds-l-row">
          <div className="name ds-l-col--1">{year}</div>
          <div className="name ds-l-col--2">{name}</div>
          <div className="status ds-l-col--2">{statusText}</div>
          <div className="actions ds-l-col--3">{lastEditedNote}</div>
          <div className="actions ds-l-col--auto">
            <Link
              to={link1URL}
              target={anchorTarget}
              aria-label={`${link1Text} ${name} ${year}`}
            >
              {link1Text}
            </Link>
            {statusText === "Certified and Submitted" &&
              userRole === AppRoles.CMS_USER && (
                <span>
                  {" "}
                  <button
                    data-testid={"uncertifyButton"}
                    className="link"
                    onClick={toggleModal}
                  >
                    Uncertify
                  </button>
                </span>
              )}
          </div>

          {isShowing && (
            <Dialog
              data-testid={"uncertifyModal"}
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
          <div className="status ds-l-col--2">{statusText}</div>
          <div className="actions ds-l-col--3">{lastEditedNote}</div>
          <div className="actions ds-l-col--1">
            <Link
              to={link1URL}
              target={anchorTarget}
              data-testid="report-action-button"
            >
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
  link1URL: PropTypes.string.isRequired,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  statusText: PropTypes.string,
  userRole: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  username: PropTypes.string,
  lastChanged: PropTypes.string.isRequired,
  timeZone: PropTypes.string,
};
ReportItem.defaultProps = {
  link1Text: "View",
  link1URL: "#",
  statusText: "Missing Status",
};

const mapState = (state) => ({
  user: state.reportStatus.username,
});

const mapDispatch = { theUncertify };

export default connect(mapState, mapDispatch)(ReportItem);
