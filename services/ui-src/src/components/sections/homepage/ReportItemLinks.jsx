import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { Link } from "react-router";
import { Dialog } from "@cmsgov/design-system";
// utils
import { uncertifyReport } from "../../../actions/uncertify";
import useModal from "../../../hooks/useModal";
// types
import { AppRoles, REPORT_STATUS } from "../../../types";

const rolesThatUncertify = [
  AppRoles.CMS_ADMIN,
  AppRoles.CMS_USER,
  AppRoles.CMS_APPROVER,
];

const ReportItemLinks = ({
  actionLinkText = "View",
  actionLinkURL,
  stateCode,
  status,
  userRole,
  year,
}) => {
  const dispatch = useDispatch();
  const { isShowing, toggleModal } = useModal();

  const uncertify = () => {
    dispatch(uncertifyReport(stateCode, Number(year)));
    toggleModal();
    window.location.reload(false);
  };

  const printFormUrl = `/print?year=${year}&state=${stateCode}`;

  return (
    <>
      <Link
        className="report-item-link"
        to={actionLinkURL}
        aria-label={`${actionLinkText} ${stateCode} ${year} report`}
        data-testid="report-action-button"
      >
        {actionLinkText}
      </Link>

      {status === REPORT_STATUS.certified &&
        rolesThatUncertify.includes(userRole) && (
          <button
            aria-label={`Uncertify ${stateCode} ${year} report`}
            className="report-item-link"
            data-testid="uncertifyButton"
            onClick={toggleModal}
          >
            Uncertify
          </button>
        )}

      <Link
        className="report-item-link"
        to={printFormUrl}
        aria-label={`Print ${stateCode} ${year} report`}
        target="_blank"
        data-testid="print-form"
      >
        Print
      </Link>

      {isShowing && (
        <Dialog
          onExit={toggleModal}
          heading={`Uncertify ${stateCode} ${year} report?`}
          actions={[
            <button
              className="ds-c-button ds-c-button--solid ds-u-margin-right--1"
              key="primary"
              onClick={uncertify}
              aria-label={`Uncertify ${stateCode} ${year} report`}
            >
              Yes, Uncertify
            </button>,
          ]}
        >
          Uncertifying will send this CARTS report back to the stateCode user
          who submitted it
        </Dialog>
      )}
    </>
  );
};

ReportItemLinks.propTypes = {
  actionLinkText: PropTypes.string,
  actionLinkURL: PropTypes.string.isRequired,
  stateCode: PropTypes.string.isRequired,
  status: PropTypes.string,
  userRole: PropTypes.string.isRequired,
  year: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default ReportItemLinks;
