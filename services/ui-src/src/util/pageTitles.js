// Resolves a unique, descriptive document title for every route (WCAG 2.4.2).
// Routes are matched with React Router's matchRoutes against the shared
// ROUTE_PATHS registry; section titles come from the form JSON (Redux formData).
import { matchRoutes } from "react-router";
import { ROUTE_PATHS } from "./routePaths";
import statesArray from "../components/utils/statesArray";

const APP_SUFFIX = "CARTS";
// en dash with surrounding spaces, e.g. "User profile – CARTS"
const TITLE_SEPARATOR = " – ";

const stateNameFromAbbr = (abbr) =>
  statesArray.find(({ value }) => value === abbr)?.label || "";

// State name for form/print titles: admins viewing another state get it from the
// matched :state param (a two-letter abbr); state users get their own from Redux.
const routeStateName = (params, context) =>
  params.state
    ? context.globalStateName ||
      stateNameFromAbbr(params.state) ||
      context.stateUserName
    : context.stateUserName || "";

// Most specific section/subsection title from formData, or null while loading.
export const selectFormRouteTitle = (formData, ordinal, subsectionMarker) => {
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

  // Untitled subsections (sections 00-02, 04-06 each have one) fall back to the
  // section title.
  if (subsectionMarker) {
    const marker = subsectionMarker.toLowerCase();
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
const buildSectionTitle = (params, context) => {
  const stateYear = `${routeStateName(params, context)} ${params.year}`.trim();
  const sectionTitle = selectFormRouteTitle(
    context.formData,
    Number(params.sectionOrdinal),
    params.subsectionMarker
  );

  // Omit the section title while formData loads rather than render an empty one.
  return sectionTitle
    ? `${sectionTitle}${TITLE_SEPARATOR}${stateYear}${TITLE_SEPARATOR}${APP_SUFFIX}`
    : `${stateYear}${TITLE_SEPARATOR}${APP_SUFFIX}`;
};

// Route -> title table. Each path is a ROUTE_PATHS pattern; each title(params,
// context) returns the document title. The drift-guard test asserts this covers
// every ROUTE_PATHS entry.
export const titleRoutes = [
  {
    path: ROUTE_PATHS.home,
    title: (_params, context) =>
      context.hasUser
        ? "CHIP Annual Reporting Template System (CARTS)"
        : `Login${TITLE_SEPARATOR}${APP_SUFFIX}`,
  },
  {
    path: ROUTE_PATHS.userProfile,
    title: () => `User profile${TITLE_SEPARATOR}${APP_SUFFIX}`,
  },
  {
    path: ROUTE_PATHS.getHelp,
    title: () => `How can we help you?${TITLE_SEPARATOR}${APP_SUFFIX}`,
  },
  {
    path: ROUTE_PATHS.templates,
    title: () => `Generate form base templates${TITLE_SEPARATOR}${APP_SUFFIX}`,
  },
  {
    path: ROUTE_PATHS.stateReports,
    title: () => `State reports${TITLE_SEPARATOR}${APP_SUFFIX}`,
  },
  {
    path: ROUTE_PATHS.print,
    title: (_params, context) => {
      const query = new URLSearchParams(context.search);
      const stateName =
        context.stateUserName || stateNameFromAbbr(query.get("state")) || "";
      const year = query.get("year") || context.formYear;
      return `${stateName} CARTS ${year || ""} Report`
        .replace(/\s+/g, " ")
        .trim();
    },
  },
  {
    path: ROUTE_PATHS.certifyAndSubmit,
    title: (params, context) =>
      `Certify and Submit${TITLE_SEPARATOR}${`${routeStateName(params, context)} ${params.year}`.trim()}${TITLE_SEPARATOR}${APP_SUFFIX}`,
  },
  { path: ROUTE_PATHS.sectionSubsection, title: buildSectionTitle },
  { path: ROUTE_PATHS.section, title: buildSectionTitle },
  { path: ROUTE_PATHS.viewsSectionSubsection, title: buildSectionTitle },
  { path: ROUTE_PATHS.viewsSection, title: buildSectionTitle },
  {
    path: ROUTE_PATHS.notFound,
    title: () => `Page not found${TITLE_SEPARATOR}${APP_SUFFIX}`,
  },
];

// Resolve the document title for the current route from a context object
// (pathname, search, hasUser, formData, stateUserName, globalStateName, formYear).
export const getPageTitle = (context = {}) => {
  const { pathname = "/" } = context;
  const matches = matchRoutes(titleRoutes, { pathname }) || [];
  const match = matches[matches.length - 1];

  // The catch-all "*" route guarantees a match, but stay defensive.
  if (!match) {
    return `Page not found${TITLE_SEPARATOR}${APP_SUFFIX}`;
  }

  return match.route.title(match.params, context);
};
