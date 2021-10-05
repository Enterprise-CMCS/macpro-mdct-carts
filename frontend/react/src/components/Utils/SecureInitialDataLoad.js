import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useOktaAuth } from "@okta/okta-react";
import { loadUser } from "../../actions/initial";
import { setToken } from "../../authenticatedAxios";

const SecureInitialDataLoad = ({ userData }) => {
  // If userData is false, then we're logging in with Okta. Otherwise, we're
  // logging in with a dev user that bypasses Okta.

  const { authState, authService } = useOktaAuth() ?? {};
  const dispatch = useDispatch();

  useEffect(() => {
    if (userData !== false) {
      setToken();
      dispatch(loadUser(userData.userToken));
    }
  }, []);

  useEffect(() => {
    // useOktaAuth() will return null if this component is rendered outside
    // of an Okta-provided <Security> component. Because that can happen in dev,
    // we need to check for it. If these don't exist, we're not using Okta, so
    // just bail out because we don't actually need to do the stuff inside the
    // brackets.
    if (authState && authService) {
      if (!authState.isAuthenticated) {
        if (authState.error) {
          // Logout if there is an error
          authService.logout("/");
        }
        if (!authState.isPending) {
          authService.login();
        } else {
          // show logged-out page here?
        }
      } else {
        setToken(authState.accessToken);
        dispatch(loadUser());
      }
    }
  }, [authState, authService]);

  return null;
};

export default SecureInitialDataLoad;
