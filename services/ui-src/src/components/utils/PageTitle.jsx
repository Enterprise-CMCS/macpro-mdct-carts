import { useEffect } from "react";
import { useLocation } from "react-router";
import { shallowEqual, useSelector } from "react-redux";
import { useUser } from "../../hooks/authHooks";
import { getPageTitle } from "../../util/pageTitles";

/**
 * Sets a unique, descriptive document.title for every route (WCAG 2.4.2).
 * Rendered once near the app root; reads the current location and Redux
 * form data so section titles stay in sync with the underlying JSON.
 *
 * This component only forwards raw location/user/Redux values — all routing
 * and title logic (including which state name to show) lives in the pure
 * resolver in util/pageTitles.js.
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

  const title = getPageTitle({
    pathname,
    search,
    hasUser: Boolean(user),
    formData,
    stateUserName,
    globalStateName,
    formYear,
  });

  useEffect(() => {
    document.title = title;
  }, [title]);

  return null;
};

export default PageTitle;
