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
              <h3>CARTS reports</h3>

              <div className="carts-report ds-l-container preview__grid">
                <div className="report-header ds-l-row">
                  <div className="name ds-l-col">Name</div>
                  <div className="status ds-l-col">Status</div>
                  <div className="last-edited ds-l-col">Last Edited</div>
                  <div className="actions ds-l-col">Actions</div>
                </div>

                {/* <div className="report-item ds-l-row">
                  <div className="name ds-l-col">NY-CARTS-FY2020</div>
                  <div className="status ds-l-col">Draft</div>
                  <div className="last-edited ds-l-col">1:32pm | 9/21/20</div>
                  <div className="actions ds-l-col">
                    <a href="#">Edit</a> | <a href="#">Download</a>
                  </div>
                </div>

                <div className="report-item ds-l-row">
                  <div className="name ds-l-col">NY-CARTS-FY2019</div>
                  <div className="status ds-l-col">Under Review</div>
                  <div className="last-edited ds-l-col">7:46am | 3/20/20</div>
                  <div className="actions ds-l-col">
                    <a href="#">Download</a> | <a href="#">Uncertify</a>
                  </div>
                </div>

                <div className="report-item ds-l-row">
                  <div className="name ds-l-col">NY-CARTS-FY2018</div>
                  <div className="status ds-l-col">
                    <a href="#">Posted on Medicaid.gov</a>
                  </div>
                  <div className="last-edited ds-l-col">5:43pm | 1/26/19</div>
                  <div className="actions ds-l-col">
                    <a href="#">Download</a> | <a href="#">Uncertify</a>
                  </div>
                </div> */}

                <ReportItem
                  year="NY-CARTS-2018"
                  status={'<a href="#">Posted on Medicaid.gov</a>'}
                  lastEditedTime="5:43pm"
                  lastEditedDate="1/26/19"
                  link1URL="#"
                  link2URL="#"
                  current={false}
                />

                {/* <div className="report-item ds-l-row">
                  <div className="name ds-l-col">NY-CARTS-FY2017</div>
                  <div className="status ds-l-col">
                    <a href="#">Posted on Medicaid.gov</a>
                  </div>
                  <div className="last-edited ds-l-col">5:00am | 2/13/18</div>
                  <div className="actions ds-l-col">
                    <a href="#">Download</a> | <a href="#">Uncertify</a>
                  </div>
                </div>

                <div className="report-item ds-l-row">
                  <div className="name ds-l-col">NY-CARTS-FY2016</div>
                  <div className="status ds-l-col">
                    <a href="#">Posted on Medicaid.gov</a>
                  </div>
                  <div className="last-edited ds-l-col">9:13pm | 3/20/17</div>
                  <div className="actions ds-l-col">
                    <a href="#">Download</a> | <a href="#">Uncertify</a>
                  </div>
                </div>

                <div className="report-item ds-l-row">
                  <div className="name ds-l-col">NY-CARTS-FY2015</div>
                  <div className="status ds-l-col">
                    <a href="#">Posted on Medicaid.gov</a>
                  </div>
                  <div className="last-edited ds-l-col">9:00am | 1/20/16</div>
                  <div className="actions ds-l-col">
                    <a href="#">Download</a> | <a href="#">Uncertify</a>
                  </div>
                </div>

                <div className="report-item ds-l-row">
                  <div className="name ds-l-col">NY-CARTS-FY2014</div>
                  <div className="status ds-l-col">
                    <a href="#">Posted on Medicaid.gov</a>
                  </div>
                  <div className="last-edited ds-l-col">4:44pm | 3/20/15</div>
                  <div className="actions ds-l-col">
                    <a href="#">Download</a> | <a href="#">Uncertify</a>
                  </div>
                </div>

                <div className="report-item ds-l-row">
                  <div className="name ds-l-col">NY-CARTS-FY2013</div>
                  <div className="status ds-l-col">
                    <a href="#">Posted on Medicaid.gov</a>
                  </div>
                  <div className="last-edited ds-l-col">5:05pm | 3/24/14</div>
                  <div className="actions ds-l-col">
                    <a href="#">Download</a> | <a href="#">Uncertify</a>
                  </div>
                </div>

                <div className="report-item ds-l-row">
                  <div className="name ds-l-col">NY-CARTS-FY2012</div>
                  <div className="status ds-l-col">
                    <a href="#">Posted on Medicaid.gov</a>
                  </div>
                  <div className="last-edited ds-l-col">11:46am | 2/02/13</div>
                  <div className="actions ds-l-col">
                    <a href="#">Download</a> | <a href="#">Uncertify</a>
                  </div>
                </div>

                <div className="report-item ds-l-row">
                  <div className="name ds-l-col">NY-CARTS-FY2011</div>
                  <div className="status ds-l-col">
                    <a href="#">Posted on Medicaid.gov</a>
                  </div>
                  <div className="last-edited ds-l-col">1:30pm | 3/20/12</div>
                  <div className="actions ds-l-col">
                    <a href="#">Download</a> | <a href="#">Uncertify</a>
                  </div>
                </div> */}
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
