import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ReportItem from "./ReportItem";
import TemplateDownload from "./TemplateDownload";
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
      />
    );
  }
}

const Homepage = ({ reportStatus }) => {
  const getFiscalYearTemplateLink = (year) => {
    return `/templates/FFY_${year}_CARTS_Template.pdf`;
  };

  return (
    <main className="homepage">
      <div className="ds-l-container">
        <div className="ds-l-row ds-u-padding-left--2">
          <h1 className="page-title ds-u-margin-bottom--0">
            CHIP Annual Reporting Template System (CARTS)
          </h1>
        </div>
        <TemplateDownload getTemplate={getFiscalYearTemplateLink} />
        <div className="ds-l-row">
          <div className="reports ds-l-col--12">
            <div className="carts-report preview__grid">
              <div className="ds-l-row">
                <legend className="ds-u-padding--2 ds-h3">All Reports</legend>
              </div>
              <div className="report-header ds-l-row">
                <div className="name ds-l-col--2">Year</div>
                <div className="status ds-l-col--2">Status</div>
                <div className="name ds-l-col--3">Last Edited</div>
                <div className="actions ds-l-col--4">Actions</div>
              </div>

              {Object.values(reportStatus).map(formatStateStatus)}
            </div>
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
    </main>
  );
};
Homepage.propTypes = {
  reportStatus: PropTypes.object.isRequired,
};

const mapState = (state) => ({
  reportStatus: state.reportStatus,
});

export default connect(mapState)(Homepage);
