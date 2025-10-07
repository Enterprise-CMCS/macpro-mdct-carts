import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// components
import ReportItemLinks from "./ReportItemLinks";
import SortableTable, { generateColumns } from "./SortableTable";
import TemplateDownload from "./TemplateDownload";
import { Main } from "../../layout/Main";
// types
import { REPORT_STATUS, AppRoles } from "../../../types";
// utils
import mapStatesData from "../../utils/mapStatesData";

const Homepage = ({ reportStatus }) => {
  const getFiscalYearTemplateLink = (year) => {
    return `/templates/FFY_${year}_CARTS_Template.pdf`;
  };

  // Sortable table settings
  const states = useMemo(
    () => Object.values(reportStatus ?? {}).filter(Boolean),
    [reportStatus]
  );

  const data = useMemo(() => mapStatesData(states), [states]);

  const customCells = (headKey, value, originalRowData) => {
    const { entity } = originalRowData;
    const { stateCode, status, year } = entity;

    const editable = [
      REPORT_STATUS.not_started,
      REPORT_STATUS.in_progress,
      REPORT_STATUS.uncertified,
    ].includes(status);

    const actionLinkText = editable ? "Edit" : "View";
    const actionLinkURL = `sections/${year}/00`;

    switch (headKey) {
      case "year": {
        return (
          <span className="cell-bolded">
            <span className="cell-header">Year: </span>
            {value}
          </span>
        );
      }
      case "statusText": {
        return (
          <>
            <span className="cell-header">Status: </span>
            {value}
          </>
        );
      }
      case "lastEdited": {
        return (
          <>
            <span className="cell-header">Last Edited: </span>
            {value}
          </>
        );
      }
      case "actions": {
        return (
          <ReportItemLinks
            actionLinkText={actionLinkText}
            actionLinkURL={actionLinkURL}
            stateCode={stateCode}
            status={status}
            userRole={AppRoles.STATE_USER}
            year={year}
          />
        );
      }
      default:
        return value;
    }
  };

  const sortableHeadRow = {
    year: { header: "Year" },
    statusText: { header: "Status" },
    lastEdited: { header: "Last Edited" },
    actions: { header: "Actions", sort: false },
  };

  const columns = generateColumns(sortableHeadRow, true, customCells);

  return (
    <Main className="homepage">
      <div className="ds-l-container">
        <div className="ds-l-row ds-u-padding-left--2">
          <h1 className="page-title ds-u-margin-bottom--0">
            CHIP Annual Reporting Template System (CARTS)
          </h1>
        </div>
        <TemplateDownload getTemplate={getFiscalYearTemplateLink} />
        {/*Table Heading */}
        <div className="ds-l-row">
          <h2 id="reports-heading" className="ds-h3 ds-u-padding--2">
            All Reports
          </h2>
        </div>
        <div className="ds-l-row">
          <div className="reports">
            <SortableTable
              ariaLabelledBy={"reports-heading"}
              columns={columns}
              data={data}
            />
          </div>
        </div>
        <div className="ds-l-row">
          <div className="omb-info ds-l-col--12">
            <p>
              The OMB control number for this information is OMB 0938-1148. The
              time required to complete this information collection is estimated
              to 40 hours per response, including the time to review
              instructions, search existing data resources, gather data, and
              review and submit the information.
            </p>
          </div>
        </div>
      </div>
    </Main>
  );
};

Homepage.propTypes = {
  reportStatus: PropTypes.object.isRequired,
};

const mapState = (state) => ({
  reportStatus: state.reportStatus,
});

export default connect(mapState)(Homepage);
