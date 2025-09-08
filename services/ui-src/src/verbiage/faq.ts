export default {
  accordionItems: [
    {
      type: "text",
      question:
        "What types of questions should I contact MCDT Help Desk for assistance?",
      answer:
        "For any technical issues such as CARTS access, CARTS functionality, or other systems issues, please contact the MCDT Help Desk at mdct_help@cms.hhs.gov for assistance.  For programmatic questions related to CHIP policy or to uncertify your report, please contact your CHIP Project Officer.",
    },
    {
      type: "text",
      question: "How can I “uncertify” a report to make edits?",
      answer:
        "Please contact your CHIP Project Officer to change a report’s status to “uncertified” to allow the state to make additional edits.  Please recertify the report upon completing the edits and notify your CHIP Project Officer that the report has been recertified.",
    },
    {
      type: "text",
      question: "Can more than one person at the state have access to CARTS?",
      answer:
        "Yes. There is no limitation on the number CARTS users each state may have.",
    },
    {
      type: "text",
      question: "What is the reporting timeframe for CARTS?",
      answer:
        "In the CHIP Annual Report, states assess the operation of their child health assistance programs for the previous Federal fiscal year (FFY) from October 1 to September 30.  States will receive an updated CARTS template by the start of each new FFY and complete the report by January 1.",
    },
    {
      type: "text",
      question: "When is the completed report due in CARTS?",
      answer:
        "States are statutorily required at section 2108(a) of the Social Security Act to submit their completed CHIP Annual Report by January 1 following the end of the Federal fiscal year.  Submission is achieved when a state has completed all required sections in CARTS and has changed the status to “certified”.",
    },
    {
      type: "text",
      question:
        "When I print my report, some data fields are auto-filled with “<11”.  Why does this happen?",
      answer:
        "In compliance with CMS’ cell size suppression policy, reports that reference individual beneficiaries with values of 1 to 10 are automatically adjusted to “<11” when the print feature is used in compliance with this policy and to assist in protecting the privacy of beneficiaries.  States should continue to submit raw data to CARTS, and CMS will ensure that CHIP Annual Reports posted on Medicaid.gov will continue to be in compliance with CMS’ cell size suppression policy.",
    },
    {
      type: "list",
      question:
        "Which sections of the report are pre-filled and where does that information come from?",
      listHeading: "The following sections include pre-filled cells in CARTS:",
      listAnswers: [
        "Basic State Information (pre-filled from previous Federal fiscal year CARTS)",
        "Section 2, Part 1 (Statistical Enrollment Data System) and Part 2 (American Community Survey)",
        "Section 3, Parts 5 and 6 (questions 1-7 are pre-filled from previous Federal fiscal year CARTS in odd-numbered years for the second year of cohort reporting)",
        "Section 4, Objective 1 (statutorily required strategic objective)",
        "Section 5, Part 2, FMAP Table (populated with e-FMAP rates published in the Federal Register)",
      ],
    },
  ],
};
