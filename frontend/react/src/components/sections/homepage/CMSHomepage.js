import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getAllStateStatuses } from "../../../actions/initial";
import ReportItem from "./ReportItem";
import { selectFormStatuses } from "../../../store/selectors";

const CMSHomepage = ({ getStatuses, statuses, currentYear }) => {
  useEffect(() => {
    getStatuses();
  }, []);

  return (
    <div className="homepage">
      <div className="ds-l-container">
        <div className="ds-l-row ds-u-padding-left--2">
          <h1 className="page-title ds-u-margin-bottom--0">
            CHIP Annual Report Template System (CARTS)
          </h1>
        </div>
        <div className="page-info ds-u-padding-left--2">
          <div className="edit-info">CMS user</div>
        </div>

        <div className="ds-l-row">
          <div className="reports ds-l-col--12">
            <div className="carts-report preview__grid">
              <div className="ds-l-row">
                <legend className="ds-u-padding--2 ds-h3">All Reports</legend>
              </div>
              <div className="report-header ds-l-row">
                <div className="name ds-l-col--2">Report</div>
                <div className="status ds-l-col--3">Status</div>
                <div className="actions ds-l-col--6">Actions</div>
              </div>

              {statuses
                .sort((a, b) => (a.state > b.state ? 1 : -1))
                .map(({ state, stateCode, status }) =>
                  // with statement below we don't get the three bogus records (username, status, and lastchanged)
                  stateCode.toString().length === 2 ? (
                    <ReportItem
                      key={stateCode}
                      link1URL={`/views/sections/${stateCode}/${currentYear}/00/a`}
                      name={`${state} ${currentYear}`}
                      statusText={status}
                      editor="x@y.z"
                      stateUser={false}
                    />
                  ) : null
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
CMSHomepage.propTypes = {
  getStatuses: PropTypes.func.isRequired,
  statuses: PropTypes.object.isRequired,
  currentYear: PropTypes.object.isRequired,
};

const mapState = (state) => ({
  statuses: selectFormStatuses(state),
  currentYear: state.global.formYear,
});

const mapDispatch = {
  getStatuses: getAllStateStatuses ?? {},
};

export default connect(mapState, mapDispatch)(CMSHomepage);
