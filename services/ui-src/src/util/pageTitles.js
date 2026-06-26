/**
 * Centralized page-title resolution for WCAG 2.4.2 (Page Titled).
 *
 * Every route in the app resolves to a unique, descriptive document title.
 * Routes are matched with React Router's own `matchRoutes` against the shared
 * `ROUTE_PATHS` registry — the same path patterns the router uses — so titles
 * stay aligned with routing instead of re-parsing the pathname by hand.
 *
 * Section/subsection titles are driven from the form JSON (Redux `formData`)
 * so that title text stays in sync with the content that defines each section.
 */
import { matchRoutes } from "react-router";
import { ROUTE_PATHS } from "./routePaths";
import statesArray from "../components/utils/statesArray";

const BASE = "CARTS";
// en dash with surrounding spaces, e.g. "User profile – CARTS"
const SEP = " – ";

const stateNameFromAbbr = (abbr) =>
  statesArray.find(({ value }) => value === abbr)?.label || "";

/**
 * Resolve the full state name for form/print titles. State users get their own
 * state from Redux; admins viewing another state get it from the matched
 * `:state` route param (CARTS stores it as a two-letter abbr in the URL). This
 * reads matched route params rather than re-parsing the pathname, so it stays
 * aligned with the router.
 */
const routeStateName = (params, ctx) =>
  params.state
    ? ctx.globalStateName ||
      stateNameFromAbbr(params.state) ||
      ctx.stateUserName
    : ctx.stateUserName || "";

/**
 * Find the section/subsection title for a form route from the loaded formData.
 *
 * @param {Array} formData - Redux formData array (each entry has contents.section)
 * @param {number} ordinal - section ordinal parsed from the URL (e.g. 0, 1, 3)
 * @param {string} [subMarker] - subsection marker from the URL (e.g. "a")
 * @returns {string|null} the most specific title available, or null while loading
 */
export const selectFormRouteTitle = (formData, ordinal, subMarker) => {
  if (!Array.isArray(formData) || formData.length === 0) {
    return null;
  }

  const entry = formData.find(
    (item) => item?.contents?.section?.ordinal === ordinal
  );
  const section = entry?.contents?.section;
  if (!section) {
    return null;
  }

  // Prefer the subsection title when the URL targets a specific subsection
  // and that subsection actually has a title (sections 00-02, 04-06 have a
  // single untitled subsection, so we fall back to the section title there).
  if (subMarker) {
    const marker = subMarker.toLowerCase();
    const subsection = (section.subsections || []).find(
      (sub) => typeof sub?.id === "string" && sub.id.split("-").pop() === marker
    );
    if (subsection?.title) {
      return subsection.title;
    }
  }

  return section.title || null;
};

// Title builder shared by every form/section route (state + admin views).
// `params` come straight from React Router (year, sectionOrdinal, etc.).
const formSectionTitle = (params, ctx) => {
  const stateYear = `${routeStateName(params, ctx)} ${params.year}`.trim();
  const sectionTitle = selectFormRouteTitle(
    ctx.formData,
    Number(params.sectionOrdinal),
    params.subsectionMarker
  );

  // While formData is still loading we omit the (empty) section title rather
  // than render a misleading one; the title updates once data arrives.
  return sectionTitle
    ? `${sectionTitle}${SEP}${stateYear}${SEP}${BASE}`
    : `${stateYear}${SEP}${BASE}`;
};

/**
 * Declarative route -> title table. Each `path` is a shared `ROUTE_PATHS`
 * pattern; each `title(params, ctx)` returns the document title for a match.
 * Exported so the drift-guard test can assert it covers every ROUTE_PATHS entry.
 */
export const titleRoutes = [
  {
    path: ROUTE_PATHS.home,
    title: (_params, ctx) =>
      ctx.hasUser
        ? "CHIP Annual Reporting Template System (CARTS)"
        : `Login${SEP}${BASE}`,
  },
  {
    path: ROUTE_PATHS.userProfile,
    title: () => `User profile${SEP}${BASE}`,
  },
  {
    path: ROUTE_PATHS.getHelp,
    title: () => `How can we help you?${SEP}${BASE}`,
  },
  {
    path: ROUTE_PATHS.templates,
    title: () => `Generate form base templates${SEP}${BASE}`,
  },
  {
    path: ROUTE_PATHS.stateReports,
    title: () => `State reports${SEP}${BASE}`,
  },
  {
    // Print view: "[State] CARTS [Year] Report"
    path: ROUTE_PATHS.print,
    title: (_params, ctx) => {
      const query = new URLSearchParams(ctx.search);
      const stateName =
        ctx.stateUserName || stateNameFromAbbr(query.get("state")) || "";
      const year = query.get("year") || ctx.formYear;
      return `${stateName} CARTS ${year || ""} Report`
        .replace(/\s+/g, " ")
        .trim();
    },
  },
  {
    path: ROUTE_PATHS.certifyAndSubmit,
    title: (params, ctx) =>
      `Certify and Submit${SEP}${`${routeStateName(params, ctx)} ${params.year}`.trim()}${SEP}${BASE}`,
  },
  { path: ROUTE_PATHS.sectionSubsection, title: formSectionTitle },
  { path: ROUTE_PATHS.section, title: formSectionTitle },
  { path: ROUTE_PATHS.viewsSectionSubsection, title: formSectionTitle },
  { path: ROUTE_PATHS.viewsSection, title: formSectionTitle },
  {
    path: ROUTE_PATHS.notFound,
    title: () => `Page not found${SEP}${BASE}`,
  },
];

/**
 * Resolve the document title for the current route.
 *
 * @param {object} ctx
 * @param {string} ctx.pathname - location.pathname
 * @param {string} [ctx.search] - location.search (for /print)
 * @param {boolean} ctx.hasUser - whether a user is authenticated
 * @param {Array} [ctx.formData] - Redux formData (drives section titles)
 * @param {string} [ctx.stateUserName] - the signed-in state user's state name
 * @param {string} [ctx.globalStateName] - state name for admin `/views/...` routes
 * @param {(string|number)} [ctx.formYear] - report year for form/print titles
 * @returns {string} the document title
 */
export const getPageTitle = ({
  pathname = "/",
  search = "",
  hasUser = false,
  formData = [],
  stateUserName = "",
  globalStateName = "",
  formYear = "",
} = {}) => {
  const matches = matchRoutes(titleRoutes, { pathname }) || [];
  const match = matches[matches.length - 1];

  // The catch-all "*" route guarantees a match, but stay defensive.
  if (!match) {
    return `Page not found${SEP}${BASE}`;
  }

  return match.route.title(match.params, {
    search,
    hasUser,
    formData,
    stateUserName,
    globalStateName,
    formYear,
  });
};
