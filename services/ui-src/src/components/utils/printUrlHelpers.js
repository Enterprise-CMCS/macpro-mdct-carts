import { AppRoles } from "../../types";

/*
 * These helpers exist so that any value pulled from the URL is in the exact
 * shape we expect before it ever gets concatenated into a link or query
 * string. Each `is*` predicate answers "is this value safe to use as-is?"
 * and each `parse*` helper returns a normalized value (or null if invalid).
 */

const YEAR = /^\d{4}$/;
const STATE_ID = /^[A-Z]{2}$/i;
const SECTION_ORDINAL = /^\d{2}$/;
const SECTION_ID = /^\d{4}-\d{2}$/;
const SUBSECTION_MARKER = /^[a-z]$/i;
const SUBSECTION_ID = /^\d{4}-\d{2}-[a-z]$/i;

const SECTION_THREE_ORDINAL = "03";
const DEFAULT_SUBSECTION_MARKER = "a";

const matches = (value, pattern) =>
  typeof value === "string" && pattern.test(value);

const isYear = (value) => matches(value, YEAR);
const isSectionOrdinal = (value) => matches(value, SECTION_ORDINAL);
const isSectionId = (value) => matches(value, SECTION_ID);
const isSubsectionId = (value) => matches(value, SUBSECTION_ID);

const parseStateId = (value) =>
  matches(value, STATE_ID) ? value.toUpperCase() : null;

const parseSubsectionMarker = (value) =>
  matches(value, SUBSECTION_MARKER) ? value.toLowerCase() : null;

const parseYear = (value) => {
  const stringified = `${value ?? ""}`;
  return isYear(stringified) ? stringified : null;
};

/**
 * Pull validated print-related values out of the current router pathname.
 * Anything that doesn't match the expected shape is dropped, so callers
 * never see unsanitized location data.
 */
const getPrintRouteContext = (role, pathname) => {
  const segments = pathname.split("/").filter(Boolean);

  if (role === AppRoles.STATE_USER) {
    const [root, year, ordinal, marker] = segments;
    if (root !== "sections") {
      return {};
    }

    return {
      routeYear: isYear(year) ? year : null,
      routeSectionOrdinal: isSectionOrdinal(ordinal) ? ordinal : null,
      routeSubsectionMarker: parseSubsectionMarker(marker),
    };
  }

  const [root, sub, state, year, ordinal, marker] = segments;
  if (root !== "views" || sub !== "sections") {
    return {};
  }

  return {
    routeStateId: parseStateId(state),
    routeYear: isYear(year) ? year : null,
    routeSectionOrdinal: isSectionOrdinal(ordinal) ? ordinal : null,
    routeSubsectionMarker: parseSubsectionMarker(marker),
  };
};

/**
 * Build a `/print` URL using only validated inputs. Falls back to `/print`
 * when the year or state is missing or malformed, and silently drops any
 * section/subsection ids that don't match the expected shape.
 */
const printFormUrl = (
  formYear,
  stateId,
  sectionId = null,
  subsectionId = null
) => {
  const safeYear = parseYear(formYear);
  const safeState = parseStateId(stateId);

  if (!safeYear || !safeState) {
    return "/print";
  }

  const params = new URLSearchParams({ year: safeYear, state: safeState });

  if (isSectionId(sectionId)) {
    params.set("sectionId", sectionId);
  }

  if (isSubsectionId(subsectionId)) {
    params.set("subsectionId", subsectionId);
  }

  return `/print?${params.toString()}`;
};

export {
  getPrintRouteContext,
  printFormUrl,
  isYear,
  isSectionOrdinal,
  isSectionId,
  isSubsectionId,
  parseStateId,
  parseSubsectionMarker,
  parseYear,
  SECTION_THREE_ORDINAL,
  DEFAULT_SUBSECTION_MARKER,
};
