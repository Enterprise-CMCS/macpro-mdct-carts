import React from "react";
import ReportItem from "./ReportItem";
import { DownloadDrawer } from "./DownloadDrawer";

const Homepage = () => (
  <div className="homepage">
    <div className="ds-l-container">
      <div className="ds-l-row ds-u-padding-left--2">
        <h1 className="page-title ds-u-margin-bottom--0">
          CHIP Annual Report Template System (CARTS)
        </h1>
      </div>
      <DownloadDrawer show={false} />
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

            <ReportItem
              name="2020"
              lastEditedTime="1:32pm"
              lastEditedDate="9/21/20"
              link1URL="/sections/2020/00"
              link1Text="Edit"
              link2URL="#"
              link2Text={null}
              statusText="In Progress"
              editor="karen.dalton@state.gov"
            />
          </div>
        </div>
      </div>
      <div className="ds-l-row">
        <div className="omb-info ds-l-col--12">
          <p>
            PRA Disclosure Statement. This information is being collected to
            assist the Centers for Medicare &amp; Medicaid Services (CMS) in
            partnership with States with the ongoing management of Medicaid and
            CHIP programs and policies. This mandatory information collection
            (42 U.S.C. 1397hh) will be used to help each state meet the
            statutory requirements at section 2108(a) of the Social Security Act
            to assess the operation of the State child health plan in each
            Federal fiscal year and to report the results of the assessment
            including the progress made in reducing the number of uncovered,
            low-income children. Under the Privacy Act of 1974 any personally
            identifying information obtained will be kept private to the extent
            of the law. According to the Paperwork Reduction Act of 1995, no
            persons are required to respond to a collection of information
            unless it displays a valid OMB control number. The valid OMB control
            number for this information collection is 0938-1148 (CMS-10398 #1).
            The time required to complete this information collection is
            estimated to average 40 hours per response, including the time to
            review instructions, search existing data resources, gather the data
            needed, and complete and review the information collection. Send
            comments regarding this burden estimate or any other aspect of this
            collection of information, including suggestions for reducing this
            burden, to CMS, 7500 Security Boulevard, Attn: Paperwork Reduction
            Act Reports Clearance Officer, Mail Stop C4-26-05, Baltimore,
            Maryland 21244-1850.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default Homepage;
