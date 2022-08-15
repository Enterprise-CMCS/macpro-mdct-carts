import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Auth } from "aws-amplify";
import { UserContext } from "./userContext";
import { AppRoles, IdmRoles } from "../../types";
import { loadUser } from "../../actions/initial";
import { useDispatch } from "react-redux";

const cartsProdDomain = "https://mdctcarts.cms.gov";

const authenticateWithIDM = () => {
  Auth.federatedSignIn({ customProvider: "Okta" });
};

export const UserProvider = ({ children }) => {
  const history = useHistory();
  const location = useLocation();
  const isProduction =
    window.location.origin === cartsProdDomain ||
    window.location.origin.includes("dt4brcxdimpa0.cloudfront.net");
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

  // "custom:cms_roles" is an string of concat roles so we need to check for the one applicable to carts
  const idmRole = user?.signInUserSession?.idToken?.payload?.[
    "custom:cms_roles"
  ]
    ?.split(",")
    .find((r) => r.includes("mdctcarts"));

  const userRole = mapIdmRoleToAppRole(idmRole);
  const isStateUser = userRole === AppRoles.STATE_USER;

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

export const mapIdmRoleToAppRole = (idmRole) => {
  switch (idmRole) {
    case IdmRoles.APPROVER:
    case IdmRoles.HELP:
      return AppRoles.HELP_DESK;
    case IdmRoles.BUSINESS_OWNER_REP:
      return AppRoles.CMS_USER;
    case IdmRoles.STATE:
      return AppRoles.STATE_USER;
    case IdmRoles.PROJECT_OFFICER:
      return AppRoles.CMS_ADMIN;
    default:
      return "";
  }
};
