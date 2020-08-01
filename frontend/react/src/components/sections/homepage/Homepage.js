import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import ReportItem from "./ReportItem";

class Homepage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      placeholder: "",
    };
  }
  render() {
    return (
      <div class="homepage">
        <div className="ds-l-container">
          <div className="ds-l-row">
            <div className="page-title ds-l-col--12">
              <h1>
                Children's Health Insurance Program Annual Report Template
                System (CARTS)
              </h1>
            </div>
          </div>
          <div className="ds-l-row">
            <div className="updates ds-l-col--12">
              <h4>Updates from Central Office</h4>
              <div className="update ds-l-row">
                <div className="icon ds-l-col--2">
                  <div className="icon-inner">
                    <FontAwesomeIcon icon={faFileAlt} />
                  </div>
                </div>
                <div className="update-contents ds-l-col--10">
                  <div className="title-date ds-l-row">
                    <div className="title ds-l-col--6">
                      <h3>FY20 template is ready for download</h3>
                    </div>
                    <div className="date ds-l-col--6">AUG, 15, 2019</div>
                  </div>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Pellentesque ornare, dolor sit amet luctus rhoncus, risus ex
                    efficitur massa, eu lacinia odio diam in leo. Donec nisl
                    tortor, ullamcorper ut tincidunt ultrices, vestibulum a
                    augue. Class aptent taciti sociosqu ad litora torquent per
                    conubia nostra, per inceptos himenaeos.
                  </p>
                  <div className="download">
                    <button class="ds-c-button ds-c-button--primary">
                      <span>Download template</span>
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ds-l-row">
            <div className="reports ds-l-col--12">
              <h3 className="report-section-title ds-l-col--12">
                CARTS reports
              </h3>

              <div className="carts-report ds-l-container preview__grid">
                <div className="report-header ds-l-row">
                  <div className="name ds-l-col">Name</div>
                  <div className="status ds-l-col">Status</div>
                  <div className="last-edited ds-l-col">Last Edited</div>
                  <div className="actions ds-l-col">Actions</div>
                </div>

                <ReportItem
                  name="NY-CARTS-FY2020"
                  lastEditedTime="1:32pm"
                  lastEditedDate="9/21/20"
                  link1URL="/basic-info"
                  link1Text="Edit"
                  link2URL="/reports/ny/2020"
                  link2Text="Download"
                  statusText="Draft"
                />

                <ReportItem
                  name="NY-CARTS-FY2019"
                  lastEditedTime="7:32am"
                  lastEditedDate="3/20/20"
                  link1URL="/reports/ny/2019"
                  link2URL="#"
                  statusText="Under review"
                />

                <ReportItem
                  name="NY-CARTS-FY2018"
                  lastEditedTime="5:43pm"
                  lastEditedDate="1/26/19"
                  link1URL="/reports/ny/2018"
                  link2URL="#"
                  statusURL="#"
                />

                <ReportItem
                  name="NY-CARTS-FY2017"
                  lastEditedTime="5:00am"
                  lastEditedDate="2/13/18"
                  link1URL="/reports/ny/2017"
                  link2URL="#"
                  statusURL="#"
                />

                <ReportItem
                  name="NY-CARTS-FY2016"
                  lastEditedTime="9:13pm"
                  lastEditedDate="3/20/17"
                  link1URL="/reports/ny/2016"
                  link2URL="#"
                  statusURL="#"
                />

                <ReportItem
                  name="NY-CARTS-FY2015"
                  lastEditedTime="9:00am"
                  lastEditedDate="1/20/16"
                  link1URL="/reports/ny/2015"
                  link2URL="#"
                  statusURL="#"
                />

                <ReportItem
                  name="NY-CARTS-FY2014"
                  lastEditedTime="4:44pm"
                  lastEditedDate="3/20/15"
                  link1URL="/reports/ny/2014"
                  link2URL="#"
                  statusURL="#"
                />

                <ReportItem
                  name="NY-CARTS-FY2013"
                  lastEditedTime="5:05am"
                  lastEditedDate="3/24/14"
                  link1URL="/reports/ny/2013"
                  link2URL="#"
                  statusURL="#"
                />

                <ReportItem
                  name="NY-CARTS-FY2012"
                  lastEditedTime="9:00am"
                  lastEditedDate="2/02/13"
                  link1URL="/reports/ny/2012"
                  link2URL="#"
                  statusURL="#"
                />

                <ReportItem
                  name="NY-CARTS-FY2011"
                  lastEditedTime="11:30am"
                  lastEditedDate="3/20/12"
                  link1URL="/reports/ny/2011"
                  link2URL="#"
                  statusURL="#"
                />
              </div>
            </div>
            <div className="ds-l-row reports-footer">
              <div className="displaying ds-l-col--6">
                Showing <span className="count">1</span> to{" "}
                <span className="count">10</span> of{" "}
                <strong>24 documents</strong>
              </div>
              <div className="pager ds-l-col--6">
                Page <span class="number-primary">1</span> ...{" "}
                <span class="number-outline">2</span>
              </div>
            </div>
          </div>
          <div className="ds-l-row">
            <div class="omb-info ds-l-col--12">
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
