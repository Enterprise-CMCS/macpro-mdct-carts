import React from "react";
import { VerticalNav } from "@cmsgov/design-system-core";

const TOC = () => {
  return (
    <div className="toc">
      <VerticalNav
        selectedId="toc"
        items={[
          {
            label: "Basic Information",
            url: "/basic-info",
            id: "basic-info",
          },
          {
            label: "Section 1: Program Fees and Policy Changes",
            url: "/1",
          },
          {
            label: "Section 2: Eligibility and Enrollment",
            select: true,
            items: [
              {
                label: "Section 2A: Enrollment and Uninsured Data",
                url: "/2a",
              },
              {
                label:
                  "Section 2B: State Strategic Objectives and Performance Goals",
                url: "/2b",
              },
            ],
          },
          {
            label: "Section 3: Program Operations",
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
            label: "Section 4: State Plan Goals and Objectives",
            url: "javascript:void(0);",
          },
          {
            label: "Section 5: Budget and Finances",
            url: "javascript:void(0);",
          },
          {
            label: "Section 6: Challenges and Accomplishments",
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
