import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { Link } from "react-router";
import { Dialog } from "@cmsgov/design-system";
// utils
import { uncertifyReport } from "../../../actions/uncertify";
import useModal from "../../../hooks/useModal";
// types
import { AppRoles } from "../../../types";

const rolesThatUncertify = [
  AppRoles.CMS_ADMIN,
  AppRoles.CMS_USER,
  AppRoles.CMS_APPROVER,
];

const ReportItem = ({
  link1Text = "View",
  link1URL = "#",
  name,
  statusText = "Missing Status",
  userRole,
  year,
  username,
  lastChanged,
  timeZone,
  stateAbbr,
}) => {
  const dispatch = useDispatch();
  const { isShowing, toggleModal } = useModal();

  const isStateUser = userRole === AppRoles.STATE_USER;

  let lastEditedNote = "";
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
    await dispatch(uncertifyReport(stateAbbr, year));
    toggleModal();
    window.location.reload(false);
  };

  const printFormUrl = `/print?year=${year}&state=${stateAbbr}`;

  return (
    <tr className="report-item ds-l-row">
      {!isStateUser && <td className="name ds-l-col--1">{year}</td>}
      <td className="name ds-l-col--2">{name}</td>
      <td className="ds-l-col--2">{statusText}</td>
      <td className="ds-l-col--3">{lastEditedNote}</td>
      <td className="ds-l-col--auto">
        <Link
          to={link1URL}
          aria-label={`${link1Text} ${stateAbbr} ${year} report`}
          data-testid="report-action-button"
        >
          {link1Text}
        </Link>{" "}
        {statusText === "Certified and Submitted" &&
          rolesThatUncertify.includes(userRole) && (
            <>
              <button
                data-testid="uncertifyButton"
                aria-label={`Uncertify ${stateAbbr} ${year} report`}
                className="link"
                onClick={toggleModal}
              >
                Uncertify
              </button>{" "}
            </>
          )}
        <Link
          className="ds-c-button--solid ds-c-button--small"
          to={printFormUrl}
          aria-label={`Print ${stateAbbr} ${year} report`}
          target="_blank"
          data-testid="print-form"
        >
          Print
        </Link>
        {isShowing && (
          <Dialog
            data-testid="uncertifyModal"
            isShowing={isShowing}
            onExit={toggleModal}
            heading={`Uncertify ${stateAbbr} ${year} report?`}
            actions={[
              <button
                className="ds-c-button ds-c-button--solid ds-u-margin-right--1"
                key="primary"
                onClick={uncertify}
                aria-label={`Uncertify ${stateAbbr} ${year} report`}
              >
                Yes, Uncertify
              </button>,
            ]}
          >
            Uncertifying will send this CARTS report back to the state user who
            submitted it
          </Dialog>
        )}
      </td>
    </tr>
  );
};

ReportItem.propTypes = {
  link1Text: PropTypes.string,
  link1URL: PropTypes.string.isRequired,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  statusText: PropTypes.string,
  userRole: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  username: PropTypes.string,
  lastChanged: PropTypes.string.isRequired,
  timeZone: PropTypes.string,
  stateAbbr: PropTypes.string.isRequired,
};

export default ReportItem;
