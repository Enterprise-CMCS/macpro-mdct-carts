import React, { Component } from "react";

class Footer extends Component {
  render() {
    return (
      <div className="footer" data-test="component-footer">
        <div className="adverts">
          <div className="ds-l-container">
            <div className="ds-l-row">
              <div className="chip-info ds-l-col--6">
                <div className="medicaid-logo">
                  <img src="/img/medicadelogo.png" alt="Medicaid.gov" />
                </div>
                <div className="macpro-logo">
                  <img src="/img/MACProLogotransparent.png" alt="MACPro.gov" />
                </div>
              </div>
              <div className="cms-branding ds-l-col--6">
                <div className="cms-logo">
                  <img
                    src="/img/hhs-logo.png"
                    alt="Department of Health and Human Services, USA"
                  />
                </div>
                <div className="cms-copy">
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
            <div className="ds-l-row">
              <div className="help ds-l-col--6">
                Email{" "}
                <a
                  data-test="attribute-email"
                  href="mailto:cartshelp@cms.hhs.gov"
                >
                  CARTSHELP@cms.hhs.gov
                </a>{" "}
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
