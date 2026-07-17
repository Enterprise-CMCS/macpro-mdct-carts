import { matchRoutes } from "react-router";
import { ROUTE_PATHS } from "./routePaths";
import statesArray from "../components/utils/statesArray";

const APP_SUFFIX = "CARTS";
const TITLE_SEPARATOR = " – ";

const appTitle = (text) => `${text}${TITLE_SEPARATOR}${APP_SUFFIX}`;

const stateNameFromAbbr = (abbr) =>
  statesArray.find(({ value }) => value === abbr)?.label || "";

// State name for form/print titles: admins viewing another state get it from the
// matched :state param. State users get their own from the store.
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

// "[lead –] [State] [Year] – CARTS".
const stateYearTitle = (lead, params, context) =>
  appTitle(
    [lead, `${routeStateName(params, context)} ${params.year}`.trim()]
      .filter(Boolean)
      .join(TITLE_SEPARATOR)
  );

// Title builder shared by every form/section route (state + admin views).
const buildSectionTitle = (params, context) =>
  stateYearTitle(
    selectFormRouteTitle(
      context.formData,
      Number(params.sectionOrdinal),
      params.subsectionMarker
    ),
    params,
    context
  );

export const titleRoutes = [
  {
    path: ROUTE_PATHS.home,
    title: (_params, context) =>
      context.hasUser
        ? "CHIP Annual Reporting Template System (CARTS)"
        : appTitle("Login"),
  },
  {
    path: ROUTE_PATHS.userProfile,
    title: () => appTitle("User profile"),
  },
  {
    path: ROUTE_PATHS.getHelp,
    title: () => appTitle("How can we help you?"),
  },
  {
    path: ROUTE_PATHS.templates,
    title: () => appTitle("Generate form base templates"),
  },
  {
    path: ROUTE_PATHS.stateReports,
    title: () => appTitle("State reports"),
  },
  {
    path: ROUTE_PATHS.print,
    title: (_params, context) => {
      const query = new URLSearchParams(context.search);
      const stateName =
        context.stateUserName || stateNameFromAbbr(query.get("state")) || "";
      const year = query.get("year") || context.formYear;
      return `${stateName} CARTS ${year || ""} Report`
        .replace(/\s+/, " ")
        .trim();
    },
  },
  {
    path: ROUTE_PATHS.certifyAndSubmit,
    title: (params, context) =>
      stateYearTitle("Certify and Submit", params, context),
  },
  { path: ROUTE_PATHS.sectionSubsection, title: buildSectionTitle },
  { path: ROUTE_PATHS.section, title: buildSectionTitle },
  { path: ROUTE_PATHS.viewsSectionSubsection, title: buildSectionTitle },
  { path: ROUTE_PATHS.viewsSection, title: buildSectionTitle },
  {
    path: ROUTE_PATHS.notFound,
    title: () => appTitle("Page not found"),
  },
];

// Resolve the document title for the current route
export const getPageTitle = (context = {}) => {
  const { pathname = "/" } = context;
  const matches = matchRoutes(titleRoutes, { pathname }) || [];
  const match = matches.at(-1);

  if (!match) {
    return appTitle("Page not found");
  }

  return match.route.title(match.params, context);
};
