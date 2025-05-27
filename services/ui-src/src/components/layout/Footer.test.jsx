import React from "react";
import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";

import Footer from "./Footer";

const footer = <Footer />;

describe("<Footer />", () => {
  it("includes federal website disclaimer", () => {
    render(footer);
    // disclaimer
    expect(
      screen.getByText(
        "A federal government website managed and paid for by the U.S. Centers for Medicare and Medicaid Services and part of the MDCT suite."
      )
    ).toBeVisible();
    // medicaid logo
    expect(
      screen.queryAllByAltText("Medicaid.gov: Keeping America Healthy").length
    ).toBeGreaterThan(0);
    // carts type treatment
    expect(
      screen.getByAltText(
        "Logo for Medicaid Data Collection Tool (MDCT): CHIP Annual Reporting Template System (CARTS)"
      )
    ).toBeVisible();
    // hhs logo
    expect(
      screen.getByAltText("Department of Health and Human Services, USA")
    ).toBeVisible();
    // security address
    expect(
      screen.getByText("7500 Security Boulevard Baltimore, MD 21244")
    ).toBeVisible();
  });
});

describe("Test Footer accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(footer);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
