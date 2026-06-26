/**
 * Centralized page-title resolution for WCAG 2.4.2 (Page Titled).
 *
 * Every route in the app resolves to a unique, descriptive document title.
 * Section/subsection titles are driven from the form JSON (Redux `formData`)
 * so that title text stays in sync with the content that defines each section.
 */

const BASE = "CARTS";
// en dash with surrounding spaces, e.g. "User profile – CARTS"
const SEP = " – ";

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

/**
 * Resolve the document title for the current route.
 *
 * @param {object} ctx
 * @param {string} ctx.pathname - location.pathname
 * @param {string} [ctx.search] - location.search (for /print)
 * @param {boolean} ctx.hasUser - whether a user is authenticated
 * @param {Array} [ctx.formData] - Redux formData (drives section titles)
 * @param {string} [ctx.stateName] - resolved full state name (e.g. "New York")
 * @param {(string|number)} [ctx.formYear] - report year for form/print titles
 * @returns {string} the document title
 */
export const getPageTitle = ({
  pathname = "/",
  search = "",
  hasUser = false,
  formData = [],
  stateName = "",
  formYear = "",
} = {}) => {
  const segments = pathname.split("/").filter(Boolean);

  // Home / login
  if (pathname === "/") {
    return hasUser
      ? "CHIP Annual Reporting Template System (CARTS)"
      : `Login${SEP}${BASE}`;
  }

  // Static authenticated pages
  if (pathname === "/user/profile") {
    return `User profile${SEP}${BASE}`;
  }
  if (pathname === "/get-help") {
    return `How can we help you?${SEP}${BASE}`;
  }
  if (pathname === "/templates") {
    return `Generate form base templates${SEP}${BASE}`;
  }
  if (pathname === "/state-reports") {
    return `State reports${SEP}${BASE}`;
  }

  // Print view: "[State] CARTS [Year] Report"
  if (pathname === "/print") {
    const year = new URLSearchParams(search).get("year") || formYear || "";
    return `${stateName} CARTS ${year} Report`.replace(/\s+/g, " ").trim();
  }

  // Form section routes (state users) and admin "views" routes
  let formTokens = null;
  if (segments[0] === "sections") {
    // /sections/:year/:sectionOrdinal(/:subsectionMarker)
    formTokens = segments.slice(1);
  } else if (segments[0] === "views" && segments[1] === "sections") {
    // /views/sections/:state/:year/:sectionOrdinal(/:subsectionMarker)
    formTokens = segments.slice(3);
  }

  if (formTokens) {
    const [year, sectionToken, subMarker] = formTokens;
    const stateYear = `${stateName} ${year}`.trim();

    if (sectionToken === "certify-and-submit") {
      return `Certify and Submit${SEP}${stateYear}${SEP}${BASE}`;
    }

    const sectionTitle = selectFormRouteTitle(
      formData,
      Number(sectionToken),
      subMarker
    );

    // While formData is still loading we omit the (empty) section title rather
    // than render a misleading one; the title updates once data arrives.
    if (sectionTitle) {
      return `${sectionTitle}${SEP}${stateYear}${SEP}${BASE}`;
    }
    return `${stateYear}${SEP}${BASE}`;
  }

  // Catch-all 404
  return `Page not found${SEP}${BASE}`;
};
