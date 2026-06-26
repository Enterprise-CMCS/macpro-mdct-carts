import { useEffect } from "react";
import { useLocation } from "react-router";
import { shallowEqual, useSelector } from "react-redux";
import { useUser } from "../../hooks/authHooks";
import statesArray from "./statesArray";
import { getPageTitle } from "../../util/pageTitles";

const stateNameFromAbbr = (abbr) =>
  statesArray.find(({ value }) => value === abbr)?.label;

/**
 * Sets a unique, descriptive document.title for every route (WCAG 2.4.2).
 * Rendered once near the app root; reads the current location and Redux
 * form data so section titles stay in sync with the underlying JSON.
 *
 * Note: we set document.title directly in an effect rather than via
 * react-helmet, whose side-effect mechanism does not apply titles under
 * React 19.
 */
export const PageTitle = () => {
  const { pathname, search } = useLocation();
  const { user } = useUser();

  const { formData, stateUserName, globalStateName, formYear } = useSelector(
    (state) => ({
      formData: state.formData,
      stateUserName: state.stateUser.name,
      globalStateName: state.global.stateName,
      formYear: state.global.formYear,
    }),
    shallowEqual
  );

  // Resolve the full state name used in form/print titles. State users get
  // their own state; admins viewing another state get it from the URL.
  let stateName = stateUserName;
  if (pathname.startsWith("/views/sections/")) {
    const abbr = pathname.split("/")[3];
    stateName = globalStateName || stateNameFromAbbr(abbr) || stateUserName;
  } else if (pathname === "/print") {
    const stateParam = new URLSearchParams(search).get("state");
    stateName = stateUserName || stateNameFromAbbr(stateParam) || "";
  }

  const title = getPageTitle({
    pathname,
    search,
    hasUser: Boolean(user),
    formData,
    stateName,
    formYear,
  });

  useEffect(() => {
    document.title = title;
  }, [title]);

  return null;
};

export default PageTitle;
