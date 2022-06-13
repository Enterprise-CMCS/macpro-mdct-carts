import { mount, shallow } from "enzyme";
import { axe } from "jest-axe";
import React from "react";

import Footer from "./Footer";
import cartsLogoGrey from "../../assets/images/MDCT_CARTS_gray_2x.png";
import deptHealthLogo from "../../assets/images/depthealthhumanservices_usa_2x.png";
import medicaidLogo from "../../assets/images/logo-MedicaidGov_2x.png";

const footer = <Footer />;

describe("<Footer />", () => {
  it("should render the Header Component correctly", () => {
    expect(shallow(footer).exists()).toBe(true);
  });

  it("includes federal website disclaimer", () => {
    const wrapper = mount(footer);
    expect(wrapper.find(".cms-copy").text()).toBe(
      "A federal government website managed and paid for by the U.S. Centers for Medicare and Medicaid Services and part of the MACPro suite."
    );
  });

  it("should include the medicaid.gov logo", () => {
    const wrapper = mount(footer);

    const medLogo = (
      <img src={medicaidLogo} alt="Medicaid.gov: Keeping America Healthy" />
    );

    expect(wrapper.containsMatchingElement(medLogo)).toBe(true);
  });

  it("should include the Carts Type Treatment", () => {
    const wrapper = mount(footer);

    const cartsLogo = (
      <img
        src={cartsLogoGrey}
        alt="Logo for Medicaid Data Collection Tool (MDCT): CHIP Annual Report Template System (CARTS)"
      />
    );

    expect(wrapper.containsMatchingElement(cartsLogo)).toBe(true);
  });

  it("should incude the Department of Health and Human Services, USA logo", () => {
    const wrapper = mount(footer);

    const deptLogo = (
      <img
        src={deptHealthLogo}
        alt="Department of Health and Human Services, USA"
      />
    );

    expect(wrapper.containsMatchingElement(deptLogo)).toBe(true);
  });

  it("should include the address for security", () => {
    const wrapper = mount(footer);
    expect(wrapper.find({ "data-testid": "address" }).text()).toBe(
      "7500 Security Boulevard Baltimore, MD 21244"
    );
  });
});

describe("Test Footer accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const wrapper = mount(footer);
    const results = await axe(wrapper.html());
    expect(results).toHaveNoViolations();
  });
});

// TODO: Update testing suite with DynamoDB endpoint (currently points to PostgreSQL endpoint)

/*
 * import React from "react";
 * import Footer from "../components/layout/Footer";
 */

// import { findByTestAttribute } from "../testUtils";

// import { shallow } from "enzyme";

// /**
//  * Factory functon to create a ShallowWrapper for the Footer component.
//  * @function setup
//  * @param {object} props - Component props specific to this setup.
//  * @param {any} state - Initial state for setup
//  * @returns {ShallowWrapper}
//  */
// const setup = (props = {}) => {
//   return shallow(<Footer {...props} />);
// };

/*
 * describe("Footer Component (shallow)", () => {
 *   const wrapper = setup();
 */

/*
 *   it("renders with appropriate data attribute", () => {
 *     const footerComponent = findByTestAttribute(wrapper, "component-footer");
 *     expect(footerComponent.length).toBe(1);
 *   });
 *   it("renders with the appropriate footer classname", () => {
 *     const footerClassname = wrapper.find(".footer");
 *     expect(footerClassname.length).toBe(1);
 *   });
 */

/*
 *   it("includes contact email address attribute", () => {
 *     const attributeEmail = findByTestAttribute(wrapper, "attribute-email");
 *     expect(attributeEmail.length).toBe(1);
 *   });
 */

/*
 *   it("includes contact email address", () => {
 *     const email = wrapper.find({ href: "mailto:mdct_help@cms.hhs.gov" });
 *     expect(email.length).toBe(1);
 *   });
 */
