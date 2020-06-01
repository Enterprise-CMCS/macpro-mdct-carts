import React, { Component } from "react";

class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <div className="adverts">
          <div class="chip-info">
            <img src="/img/new-york-temp.png" alt="Medicaid.gov" />
            <img src="/img/new-york-temp.png" alt="MACPro.gov" />
          </div>
          <div className="cms-branding">
            <div class="cms-logo">
              <img
                src="/img/new-york-temp.png"
                alt="Department of Health and Human Services, USA"
              />
            </div>
            <div class="cms-copy">
              A federal government website managed and paid for by the U.S.
              Centers for Medicare and Medicaid Services and part of the MACPro
              suite.
            </div>
          </div>
        </div>
        <div className="info">
          <div class="help">
            Email{" "}
            <a href="mailto:cartshelp@cms.hhs.gov">CARTSHELP@cms.hhs.gov</a> for
            help or feedback.
          </div>
          <div className="address">
            7500 Security Boulevard Baltimore, MD 21244
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
