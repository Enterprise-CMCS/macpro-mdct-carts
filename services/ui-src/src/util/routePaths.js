/**
 * Single source of truth for the app's route path patterns.
 *
 * Both the router (`AppRoutes.jsx`) and the document-title resolver
 * (`pageTitles.js`) import these constants, so a path can only be defined or
 * renamed in one place. `pageTitles.test.js` asserts that every entry here has
 * a corresponding title, which fails the build if the two ever drift apart.
 *
 * Patterns use React Router syntax (`:param`, `*`). Order does not matter:
 * React Router ranks matches by specificity, so e.g. the static
 * `certify-and-submit` segment always wins over `:sectionOrdinal`.
 */
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
