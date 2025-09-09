import React from "react";
// components
import { Accordion, AccordionItem } from "@cmsgov/design-system";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

const FaqAccordion = () => {
  return (
    <Accordion>
      <AccordionItem
        key={`faqquestion-1`}
        heading={
          "What types of questions should I contact MCDT Help Desk for assistance?"
        }
      >
        <p>
          For any technical issues such as CARTS access, CARTS functionality, or
          other systems issues, please contact the MCDT Help Desk at{" "}
          <a href="mailto:mdct_help@cms.hhs.gov">mdct_help@cms.hhs.gov</a> for
          assistance. For programmatic questions related to CHIP policy or to
          uncertify your report, please contact your CHIP Project Officer.
        </p>
      </AccordionItem>
      <AccordionItem
        key={`faqquestion-2`}
        heading={"How can I “uncertify” a report to make edits?"}
      >
        <p>
          Please contact your CHIP Project Officer to change a report’s status
          to “uncertified” to allow the state to make additional edits. Please
          recertify the report upon completing the edits and notify your CHIP
          Project Officer that the report has been recertified.
        </p>
      </AccordionItem>
      <AccordionItem
        key={`faqquestion-3`}
        heading={"Can more than one person at the state have access to CARTS?"}
      >
        <p>
          Yes. There is no limitation on the number CARTS users each state may
          have.
        </p>
      </AccordionItem>
      <AccordionItem
        key={`faqquestion-4`}
        heading={"What is the reporting timeframe for CARTS?"}
      >
        <p>
          In the CHIP Annual Report, states assess the operation of their child
          health assistance programs for the previous Federal fiscal year (FFY)
          from October 1 to September 30. States will receive an updated CARTS
          template by the start of each new FFY and complete the report by
          January 1.
        </p>
      </AccordionItem>
      <AccordionItem
        key={`faqquestion-5`}
        heading={"When is the completed report due in CARTS?"}
      >
        <p>
          States are statutorily required at section 2108(a) of the Social
          Security Act to submit their completed CHIP Annual Report by January 1
          following the end of the Federal fiscal year. Submission is achieved
          when a state has completed all required sections in CARTS and has
          changed the status to “certified”.
        </p>
      </AccordionItem>
      <AccordionItem
        key={`faqquestion-6`}
        heading={
          "When I print my report, some data fields are auto-filled with “<11”.  Why does this happen?"
        }
      >
        <p>
          In compliance with{" "}
          <a
            className="ds-c-external-link"
            href="https://resdac.org/articles/cms-cell-size-suppression-policy"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="CMS’ cell size suppression policy (opens in a new tab)"
          >
            CMS’ cell size suppression policy
            <FontAwesomeIcon
              className="ds-c-icon ds-c-icon--external-link ds-c-external-link__icon"
              icon={faArrowUpRightFromSquare}
              transform="up-2 right-2"
            />
          </a>
          , reports that reference individual beneficiaries with values of 1 to
          10 are automatically adjusted to “&lt;11” when the print feature is
          used in compliance with this policy and to assist in protecting the
          privacy of beneficiaries. States should continue to submit raw data to
          CARTS, and CMS will ensure that CHIP Annual Reports posted on
          Medicaid.gov will continue to be in compliance with CMS’ cell size
          suppression policy.
        </p>
      </AccordionItem>
      <AccordionItem
        key={`faqquestion-7`}
        heading={
          "Which sections of the report are pre-filled and where does that information come from?"
        }
      >
        <p>The following sections include pre-filled cells in CARTS:</p>
        <ul>
          <li>
            Basic State Information (pre-filled from previous Federal fiscal
            year CARTS)
          </li>
          <li>
            Section 2, Part 1 (Statistical Enrollment Data System) and Part 2
            (American Community Survey)
          </li>
          <li>
            Section 3, Parts 5 and 6 (questions 1-7 are pre-filled from previous
            Federal fiscal year CARTS in odd-numbered years for the second year
            of cohort reporting)
          </li>
          <li>
            Section 4, Objective 1 (statutorily required strategic objective)
          </li>
          <li>
            Section 5, Part 2, FMAP Table (populated with e-FMAP rates published
            in the Federal Register)
          </li>
        </ul>
      </AccordionItem>
    </Accordion>
  );
};

export default FaqAccordion;
