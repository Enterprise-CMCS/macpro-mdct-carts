import React from "react";

const TOC = () => {
  return (
    <div className="toc">
      <ul>
        <li>Overview</li>
        <li>Section 1: Snapshot of CHIP Programs</li>
        <li>
          Section 2: Program's Performance Measurment
          <ul>
            <li>Section 2A: Enrollment and Uninsured Data</li>
            <li>
              <a href="/2b">
                Section 2B: State Strategic Objectives and Performance Goals
              </a>
            </li>
          </ul>
        </li>
        <li>
          Section 3: Assessment of State Plan and Program Operation
          <ul>
            <li>Section 3A: Outreach</li>
            <li>Section 3B: Substitution of Coverage (Crowd-out)</li>
            <li>Section 3C: Eligibility</li>
            <li>Section 3D: Cost Sharing</li>
            <li>Section 3E: Employer Sponsored Insurance Program</li>
            <li>Section 3F: Program Integrity</li>
            <li>Section 3G: Dental Benefits</li>
            <li>Section 3H: CHIPRA CAHPS Requirement</li>
          </ul>
        </li>
        <li>Section 4: Program Financing</li>
        <li>Section 5: Challenges and Accomplishments</li>
        <li>Certify and Submit</li>
      </ul>
    </div>
  );
};

export default TOC;
