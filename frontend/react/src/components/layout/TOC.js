import React, { Component } from "react";
import { VerticalNav } from "@cmsgov/design-system-core";

class TOC extends Component {
  render() {
    // Get array of current url path
    let paths = window.location.pathname.split("/");

    return (
      <div className="toc" data-test="component-TOC">
        <VerticalNav
          data-test="component-TOC-arr"
          selectedId="toc"
          items={[
            {
              label: "Basic Information",
              url: "/basic-info",
              id: "basic-info",
              selected: paths[1] === "basic-info" ? true : false,
            },
            {
              label: "Section 1: Program Fees and Policy Changes",
              url: "/section1",
              selected: paths[1] === "section1" ? true : false,
            },
            {
              label: "Section 2: Eligibility and Enrollment",
              selected: paths[1] === "section2" ? true : false,
              items: [
                {
                  label: "Section 2A: Enrollment and Uninsured Data",
                  url: "/section2/2a",
                  selected:
                    paths[1] === "section2" && paths[2] === "2a" ? true : false,
                },
                {
                  label:
                    "Section 2B: State Strategic Objectives and Performance Goals",
                  url: "/section2/2b",
                  selected:
                    paths[1] === "section2" && paths[2] === "2b" ? true : false,
                },
              ],
            },
            {
              label: "Section 3: Program Operations",
              selected: paths[1] === "section3" ? true : false,
              items: [
                {
                  label: "Section 3A: Outreach",
                  url: "/section3/3a",
                  selected:
                    paths[1] === "section3" && paths[2] === "3a" ? true : false,
                },
                {
                  label: "Section 3B: Substitution of Coverage (Crowd-out)",
                  url: "javascript:void(0);",
                  selected:
                    paths[1] === "section3" && paths[2] === "3b" ? true : false,
                },
                {
                  label: "Section 3C: Eligibility",
                  url: "/section3/3c",
                  selected:
                    paths[1] === "section3" && paths[2] === "3c" ? true : false,
                },
                {
                  label: "Section 3D: Cost Sharing",
                  url: "/section3/3d",
                  selected:
                    paths[1] === "section3" && paths[2] === "3d" ? true : false,
                },
                {
                  label: "Section 3E: Employer Sponsored Insurance Program",
                  url: "javascript:void(0);",
                  selected:
                    paths[1] === "section3" && paths[2] === "3e" ? true : false,
                },
                {
                  label: "Section 3F: Program Integrity",
                  url: "javascript:void(0);",
                  selected:
                    paths[1] === "section3" && paths[2] === "3f" ? true : false,
                },
                {
                  label: "Section 3G: Dental Benefits",
                  url: "javascript:void(0);",
                  selected:
                    paths[1] === "section3" && paths[2] === "3g" ? true : false,
                },
                {
                  label: "Section 3H: CHIPRA CAHPS Requirement",
                  url: "javascript:void(0);",
                  selected:
                    paths[1] === "section3" && paths[2] === "3h" ? true : false,
                },
              ],
            },
            {
              label: "Section 4: State Plan Goals and Objectives",
              url: "javascript:void(0);",
              selected: paths[1] === "section4" ? true : false,
            },
            {
              label: "Section 5: Budget and Finances",
              url: "javascript:void(0);",
              selected: paths[1] === "section5" ? true : false,
            },
            {
              label: "Section 6: Challenges and Accomplishments",
              url: "javascript:void(0);",
              selected: paths[1] === "section6" ? true : false,
            },
            {
              label: "Certify and Submit",
              url: "javascript:void(0);",
              selected: paths[1] === "certify" ? true : false,
            },
          ]}
        />
      </div>
    );
  }
}

export default TOC;
