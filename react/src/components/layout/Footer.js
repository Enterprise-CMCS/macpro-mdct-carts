import React, { Component } from "react";

class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <div className="adverts">
          <div className="ds-l-container">
            <div class="ds-l-row">
              <div class="chip-info ds-l-col--6">
                <img src="/img/new-york-temp.png" alt="Medicaid.gov" />
                <img src="/img/new-york-temp.png" alt="MACPro.gov" />
              </div>
              <div className="cms-branding ds-l-col--6">
                <div class="cms-logo">
                  <img
                    src="/img/new-york-temp.png"
                    alt="Department of Health and Human Services, USA"
                  />
                </div>
                <div class="cms-copy">
                  A federal government website managed and paid for by the U.S.
                  Centers for Medicare and Medicaid Services and part of the
                  MACPro suite.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="info">
          <div className="ds-l-container">
            <div class="ds-l-row">
              <div class="help ds-l-col--6">
                Email{" "}
                <a href="mailto:cartshelp@cms.hhs.gov">CARTSHELP@cms.hhs.gov</a>{" "}
                for help or feedback.
              </div>
              <div className="address ds-l-col--6">
                7500 Security Boulevard Baltimore, MD 21244
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
