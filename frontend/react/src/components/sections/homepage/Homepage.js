import React, { Component } from "react";
import ReportItem from "./ReportItem";
import { DownloadDrawer } from "./DownloadDrawer";

class Homepage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      placeholder: "",
    };
  }
  render() {
    return (
      <div className="homepage">
        <div className="ds-l-container">
          <div className="ds-l-row ds-u-padding-left--2">
            <h1 className="page-title ds-u-margin-bottom--0">CHIP Annual Report Template System (CARTS)</h1>
          </div>
          <DownloadDrawer show={false} />
          <div className="ds-l-row">
            <div className="reports ds-l-col--12">
              <div className="carts-report preview__grid">
                <div className="ds-l-row">            <legend className="ds-u-padding--2 ds-h3">All Reports</legend>
                </div>
                <div className="report-header ds-l-row">
                  <div className="name ds-l-col--1">Year</div>
                  <div className="status ds-l-col--2">Status</div>
                  <div className="last-edited ds-l-col--6">Last Edited</div>
                  <div className="actions ds-l-col--3">Actions</div>
                </div>

                <ReportItem
                  name="2020"
                  lastEditedTime="1:32pm"
                  lastEditedDate="9/21/20"
                  link1URL="/sections/2020/00"
                  link1Text="Edit"
                  link2URL="#"
                  link2Text="View only"
                  statusText="Overdue"
                  editor="karen.dalton@state.gov"
                />

                <ReportItem
                  name="2019"
                  lastEditedTime="7:32am"
                  lastEditedDate="3/20/20"
                  link1URL="/reports/ny/2019"
                  link2URL="#"
                  statusText="Submitted"
                  editor="karen.dalton@state.gov"
                />

                <ReportItem
                  name="2018"
                  lastEditedTime="5:43pm"
                  lastEditedDate="1/26/19"
                  link1URL="/reports/ny/2018"
                  editor="lucy.santos@state.gov"
                />

                <ReportItem
                  name="2017"
                  lastEditedTime="5:00am"
                  lastEditedDate="2/13/18"
                  link1URL="/reports/ny/2017"
                  link2URL="#"
                  editor="amos.mac@state.gov"
                />

                <ReportItem
                  name="2016"
                  lastEditedTime="9:13pm"
                  lastEditedDate="3/20/17"
                  link1URL="/reports/ny/2016"
                  link2URL="#"
                  editor="jaminina.rosanthorapple@state.gov"
                />
              </div>
            </div>
            <div className="ds-l-row reports-footer">
              <div className="displaying ds-l-col--6">
                Showing <span className="count">1</span> to{" "}
                <span className="count">5</span> of{" "}
                <strong>10 documents</strong>
              </div>
              <div className="pager ds-l-col--6">
                Page <span className="number-primary">1</span> ...{" "}
                <span className="number-outline">2</span>
              </div>
            </div>
          </div>
          <div className="ds-l-row">
            <div className="omb-info ds-l-col--12">
              <p>
                The OMB control number for this information is OMB 0938-1148.
                The time required to complete this information collection is
                estimated to 40 hours per response, including the time to review
                instructions, search existing data resources, gather data, and
                review and submit the information.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Homepage;
