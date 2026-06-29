import { useEffect } from "react";
import { useLocation } from "react-router";
import { shallowEqual, useSelector } from "react-redux";
import { useUser } from "../../hooks/authHooks";
import { getPageTitle } from "../../util/pageTitles";

// Sets document.title for every route (WCAG 2.4.2). Mounted once near the app
// root; forwards raw location/user/Redux values to the resolver in pageTitles.js.
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
