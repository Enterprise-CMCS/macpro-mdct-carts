import React from "react";

const CMSHomepage = () => (
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
              <div className="name ds-l-col--1">Year</div>
              <div className="status ds-l-col--2">Status</div>
              <div className="actions ds-l-col--3">Actions</div>
            </div>
            ... here is where we’ll list all the reports...
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CMSHomepage;
