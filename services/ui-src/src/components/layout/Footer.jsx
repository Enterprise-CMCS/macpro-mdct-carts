import React from "react";
import cartsLogoGrey from "../../assets/images/MDCT_CARTS_gray_2x.png";
import deptHealthLogo from "../../assets/images/depthealthhumanservices_usa_2x.png";
import medicaidLogo from "../../assets/images/logo-MedicaidGov_2x.png";
import { useFlags } from "launchdarkly-react-client-sdk";

const Footer = () => {
  const release2025 = useFlags().release2025;
  return (
    <footer className="footer" data-test="component-footer">
      <div className="adverts">
        <div className="ds-l-container">
          <div className="ds-l-row">
            <div className="chip-info ds-l-col--6">
              <div className="medicaid-logo">
                <img
                  src={cartsLogoGrey}
                  alt="Logo for Medicaid Data Collection Tool (MDCT): CHIP Annual Reporting Template System (CARTS)"
                />
              </div>
            </div>
            <div className="cms-branding ds-l-col--6">
              <div className="ds-l-row">
                <div className="cms-branding ds-l-col--3">
                  <div className="cms-logo">
                    <img
                      src={deptHealthLogo}
                      alt="Department of Health and Human Services, USA"
                    />
                  </div>

                  <div className="cms-medicaid-mobile">
                    <img
                      src={medicaidLogo}
                      alt="Medicaid.gov: Keeping America Healthy"
                    />
                  </div>
                </div>
                <div className="cms-branding ds-l-col--9">
                  <div className="cms-copy">
                    A federal government website managed and paid for by the
                    U.S. Centers for Medicare and Medicaid Services and part of
                    the MDCT suite.
                  </div>
                </div>
              </div>
              <div className="cms-medicaid ds-l-row">
                <div className="ds-l-col--9">
                  <img
                    src={medicaidLogo}
                    alt="Medicaid.gov: Keeping America Healthy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="info">
        <div className="ds-l-container">
          <div className="ds-l-row">
            <div className="help ds-l-col--6">
              <a href="/get-help">{release2025 ? "FAQ" : "Contact Us"}</a>

              <a href="https://www.cms.gov/About-CMS/Agency-Information/Aboutwebsite/CMSNondiscriminationNotice">
                Accessibility Statement
              </a>
            </div>
            <div data-testid={"address"} className="address ds-l-col--6">
              7500 Security Boulevard Baltimore, MD 21244
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
