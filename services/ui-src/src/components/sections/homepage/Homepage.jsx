import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ReportItem from "./ReportItem";
import TemplateDownload from "./TemplateDownload";
import { Main } from "../../layout/Main";
import { REPORT_STATUS, STATUS_MAPPING, AppRoles } from "../../../types";

function formatStateStatus(item) {
  if (item) {
    const editable =
      item.status === REPORT_STATUS.not_started ||
      item.status === REPORT_STATUS.in_progress ||
      item.status === REPORT_STATUS.uncertified;
    return (
      <ReportItem
        key={item.stateCode + "-" + item.year}
        name={item.year}
        lastChanged={item.lastChanged}
        link1URL={`sections/${item.year}/00`}
        link1Text={editable ? "Edit" : "View"}
        statusText={STATUS_MAPPING[item.status]}
        userRole={AppRoles.STATE_USER}
        year={item.year}
        stateAbbr={item.stateCode}
      />
    );
  }
}

const Homepage = ({ reportStatus }) => {
  const getFiscalYearTemplateLink = (year) => {
    return `/templates/FFY_${year}_CARTS_Template.pdf`;
  };

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
          <div className="reports ds-l-col--12">
            <table
              className="carts-report preview__grid"
              aria-labelledby="reports-heading"
            >
              <thead>
                <tr className="report-header ds-l-row">
                  <th className="ds-l-col--2">Year</th>
                  <th className="ds-l-col--2">Status</th>
                  <th className="ds-l-col--3">Last Edited</th>
                  <th className="ds-l-col--4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(reportStatus).map(formatStateStatus)}
              </tbody>
            </table>
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
