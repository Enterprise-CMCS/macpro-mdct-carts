import React from "react";
import { Link, VerticalNav } from "@cmsgov/design-system-core";

const TOC = () => {
  return (
    <div className="toc">
      <VerticalNav
        selectedId="toc"
        items={[
          {
            label: "Overview",
            url: "javascript:void(0);",
            id: "overview",
          },
          {
            label: "Section 1: Snapshot of CHIP Programs",
            url: "javascript:void(0);",
          },
          {
            label: "Section 2: Program's Performance Measurement",
            select: true,
            items: [
              {
                label: "Section 2A: Enrollment and Uninsured Data",
                url: "javascript:void(0);",
              },
              {
                label:
                  "Section 2B: State Strategic Objectives and Performance Goals",
                url: "/2b",
              },
            ],
          },
          {
            label: "Section 3: Assessment of State Plan and Program Operation",
            select: true,
            items: [
              {
                label: "Section 3A: Outreach",
                url: "javascript:void(0);",
              },
              {
                label: "Section 3B: Substitution of Coverage (Crowd-out)",
                url: "javascript:void(0);",
              },
              {
                label: "Section 3C: Eligibility",
                url: "/3c",
              },
              {
                label: "Section 3D: Cost Sharing",
                url: "javascript:void(0);",
              },
              {
                label: "Section 3E: Employer Sponsored Insurance Program",
                url: "javascript:void(0);",
              },
              {
                label: "Section 3F: Program Integrity",
                url: "javascript:void(0);",
              },
              {
                label: "Section 3G: Dental Benefits",
                url: "javascript:void(0);",
              },
              {
                label: "Section 3H: CHIPRA CAHPS Requirement",
                url: "javascript:void(0);",
              },
            ],
          },
          {
            label: "Section 4: Program Financing",
            url: "javascript:void(0);",
          },
          {
            label: "Section 5: Challenges and Accomplishments",
            url: "javascript:void(0);",
          },
          {
            label: "Certify and Submit",
            url: "javascript:void(0);",
          },
        ]}
      />
    </div>
  );
};

export default TOC;
