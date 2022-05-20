import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Auth } from "aws-amplify";
import { UserContext } from "./userContext";
import { UserRoles } from "../../types";
import { loadUser } from "../../actions/initial";
import { useDispatch } from "react-redux";

const authenticateWithIDM = () => {
  Auth.federatedSignIn({ customProvider: "Okta" });
};

export const UserProvider = ({ children }) => {
  const history = useHistory();
  const location = useLocation();
  const isProduction = window.location.origin.includes("mdctqmr.cms.gov");
  const dispatch = useDispatch();

  const [user, setUser] = useState(null);
  const [showLocalLogins, setShowLocalLogins] = useState(false);

  const logout = useCallback(async () => {
    try {
      setUser(null);
      await Auth.signOut();
    } catch (error) {
      console.log("error signing out: ", error); // eslint-disable-line no-console
    }
    history.push("/");
  }, [history]);

  const checkAuthState = useCallback(async () => {
    try {
      const authenticatedUser = await Auth.currentAuthenticatedUser();
      setUser(authenticatedUser);
      dispatch(loadUser(authenticatedUser));
    } catch (e) {
      if (isProduction) {
        authenticateWithIDM();
      } else {
        setShowLocalLogins(true);
      }
    }
  }, [isProduction]);

  // "custom:cms_roles" is an string of concat roles so we need to check for the one applicable to qmr
  const userRole = user?.signInUserSession?.idToken?.payload?.[
    "custom:cms_roles"
  ]
    ?.split(",")
    .find((r) => r.includes("mdctcarts"));

  const isStateUser = userRole === UserRoles.STATE;

  const userState =
    user?.signInUserSession?.idToken?.payload?.["custom:cms_state"];

  // rerender on auth state change, checking router location
  useEffect(() => {
    checkAuthState();
  }, [location, checkAuthState]);

  const values = useMemo(
    () => ({
      user,
      logout,
      showLocalLogins,
      loginWithIDM: authenticateWithIDM,
      isStateUser,
      userState,
      userRole,
    }),
    [user, logout, showLocalLogins, isStateUser, userState, userRole]
  );

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};
