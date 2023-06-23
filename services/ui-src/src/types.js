/*
 * Roles directly from IDM, their names do not 1:1 match with expected behavior
 */
export const IdmRoles = {
  APPROVER: "mdctcarts-approver",
  BUSINESS_OWNER_REP: "mdctcarts-bor",
  HELP: "mdctcarts-help-desk",
  STATE: "mdctcarts-state-user",
  PROJECT_OFFICER: "mdctcarts-project-officer",
};

/*
 * Carts App roles, naming conveying an expected behavior
 */
export const AppRoles = {
  CMS_USER: "CMS_USER", // User who can view and reject state submissions
  CMS_ADMIN: "CMS_ADMIN", // Biz Owner - View all, release forms
  HELP_DESK: "HELP_DESK", // Help Desk - View all
  CMS_APPROVER: "CMS_APPROVER", // User who can view and uncertify state submissions
  STATE_USER: "STATE_USER", // Enter and certifies data for a year
};

export const REPORT_STATUS = {
  not_started: "not_started",
  in_progress: "in_progress",
  certified: "certified",
  uncertified: "uncertified",
  accepted: "accepted",
  submitted: "submitted",
  published: "published",
};

export const STATUS_MAPPING = {
  not_started: "Not Started",
  in_progress: "In Progress",
  certified: "Certified and Submitted",
  uncertified: "Uncertified",
  accepted: "Accepted",
  submitted: "Submitted",
  published: "Published",
};
