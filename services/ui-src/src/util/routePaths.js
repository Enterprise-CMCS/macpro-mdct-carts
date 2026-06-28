// Single source of route path patterns, shared by AppRoutes.jsx and
// pageTitles.js so a path is defined once. React Router syntax (:param, *);
// order doesn't matter since matches are ranked by specificity.
export const ROUTE_PATHS = {
  home: "/",
  userProfile: "/user/profile",
  print: "/print",
  getHelp: "/get-help",
  // State user form URLs
  sectionSubsection: "/sections/:year/:sectionOrdinal/:subsectionMarker",
  section: "/sections/:year/:sectionOrdinal",
  certifyAndSubmit: "/sections/:year/certify-and-submit",
  // Admin / CMS user form URLs
  viewsSectionSubsection:
    "/views/sections/:state/:year/:sectionOrdinal/:subsectionMarker",
  viewsSection: "/views/sections/:state/:year/:sectionOrdinal",
  stateReports: "/state-reports",
  templates: "/templates",
  // Catch-all (404)
  notFound: "*",
};
