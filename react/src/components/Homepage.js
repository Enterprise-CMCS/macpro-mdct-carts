import React, { Component } from "react";
import { Button as button } from "@cmsgov/design-system-core";

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
            <div className="page-title">
              <h1>
                Children's Health Insurance Program Annual Report Template
                System (CARTS)
              </h1>
            </div>
          </div>
          <div className="ds-l-row">
            <div className="updates">
              <h4>Updates from Central Office</h4>
              <div className="update ds-l-row">
                <div className="icon ds-l-col--2">
                  <img
                    src={process.env.PUBLIC_URL + "/img/states/ny.svg"}
                    alt="Medicaid.gov"
                  />
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
                      Download template
                      {/* <i class="fas fa-plus"></i> */}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ds-l-row">
            <div className="reports">
              <h3>CARTS reports</h3>
              <table className="ds-c-table ds-c-table--borderless">
                <thead>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Last Edited</th>
                  <th>Actions</th>
                </thead>
                <tbody>
                  <tr>
                    <td className="name">NY-CARTS-FY2020</td>
                    <td>Draft</td>
                    <td>1:32pm | 9/21/20</td>
                    <td>
                      <a href="#">Edit</a> | <a href="#">Download</a>
                    </td>
                  </tr>
                  <tr>
                    <td className="name">NY-CARTS-FY2019</td>
                    <td>Under review</td>
                    <td>7:46am | 3/20/20</td>
                    <td>
                      <a href="#">Download</a> | <a href="#">Uncertify</a>
                    </td>
                  </tr>
                  <tr>
                    <td className="name">NY-CARTS-FY2018</td>
                    <td>
                      <a href="#">Posted on Medicaid.gov</a>
                    </td>
                    <td>5:43pm | 1/26/19</td>
                    <td>
                      <a href="#">Download</a> | <a href="#">Uncertify</a>
                    </td>
                  </tr>
                  <tr>
                    <td className="name">NY-CARTS-FY2017</td>
                    <td>
                      <a href="#">Posted on Medicaid.gov</a>
                    </td>
                    <td>5:00am | 2/13/18</td>
                    <td>
                      <a href="#">Download</a> | <a href="#">Uncertify</a>
                    </td>
                  </tr>
                  <tr>
                    <td className="name">NY-CARTS-FY2016</td>
                    <td>
                      <a href="#">Posted on Medicaid.gov</a>
                    </td>
                    <td>9:13pm | 3/20/17</td>
                    <td>
                      <a href="#">Download</a> | <a href="#">Uncertify</a>
                    </td>
                  </tr>
                  <tr>
                    <td className="name">NY-CARTS-FY2015</td>
                    <td>
                      <a href="#">Posted on Medicaid.gov</a>
                    </td>
                    <td>9:00am | 1/20/16</td>
                    <td>
                      <a href="#">Download</a> | <a href="#">Uncertify</a>
                    </td>
                  </tr>
                  <tr>
                    <td className="name">NY-CARTS-FY2014</td>
                    <td>
                      <a href="#">Posted on Medicaid.gov</a>
                    </td>
                    <td>4:44pm | 3/20/15</td>
                    <td>
                      <a href="#">Download</a> | <a href="#">Uncertify</a>
                    </td>
                  </tr>
                  <tr>
                    <td className="name">NY-CARTS-FY2013</td>
                    <td>
                      <a href="#">Posted on Medicaid.gov</a>
                    </td>
                    <td>5:05pm | 3/24/14</td>
                    <td>
                      <a href="#">Download</a> | <a href="#">Uncertify</a>
                    </td>
                  </tr>
                  <tr>
                    <td className="name">NY-CARTS-FY2012</td>
                    <td>
                      <a href="#">Posted on Medicaid.gov</a>
                    </td>
                    <td>9:00am | 2/02/13</td>
                    <td>
                      <a href="#">Download</a> | <a href="#">Uncertify</a>
                    </td>
                  </tr>
                  <tr>
                    <td className="name">NY-CARTS-FY2011</td>
                    <td>
                      <a href="#">Posted on Medicaid.gov</a>
                    </td>
                    <td>11:30pm | 3/20/12</td>
                    <td>
                      <a href="#">Download</a> | <a href="#">Uncertify</a>
                    </td>
                  </tr>
                </tbody>
              </table>
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
            <div class="omb-info">
              The OMB control number for this information is OMB 0938-1148. The
              time required to complete this information collection is estimated
              to 40 hours per response, including the time to review
              instructions, search existing data resources, gather data, and
              review and submit the information.
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Homepage;
