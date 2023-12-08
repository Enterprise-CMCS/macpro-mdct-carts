import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Auth } from "aws-amplify";
import { UserContext } from "./userContext";
import { AppRoles, IdmRoles } from "../../types";
import { loadUser } from "../../actions/initial";
import { useDispatch } from "react-redux";
import config from "../../config";

const authenticateWithIDM = () => {
  Auth.federatedSignIn({ customProvider: "Okta" });
};

export const UserProvider = ({ children }) => {
  const location = useLocation();
  const idmLoginOnly = window.location.origin.includes(".cms.gov");
  const dispatch = useDispatch();

  const [user, setUser] = useState(null);
  const [showLocalLogins, setShowLocalLogins] = useState(false);

  const logout = useCallback(async () => {
    try {
      setUser(null);
      localStorage.removeItem("mdctcarts_session_exp");
      await Auth.signOut();
    } catch (error) {
      console.log("error signing out: ", error); // eslint-disable-line no-console
    }
    window.location.href = config.POST_SIGNOUT_REDIRECT;
  }, []);

  const checkAuthState = useCallback(async () => {
    // Allow Post Logout flow alongside user login flow
    if (location?.pathname.toLowerCase() === "/postlogout") {
      window.location.href = config.POST_SIGNOUT_REDIRECT;
      return;
    }

    // Authenticate
    try {
      const session = await Auth.currentSession();
      const payload = session.getIdToken().payload;
      const { email, given_name, family_name } = payload;
      // "custom:cms_roles" is an string of concat roles so we need to check for the one applicable to CARTS
      const cms_role = payload["custom:cms_roles"] ?? "";
      let userRole = cms_role.split(",").find((r) => r.includes("mdctcarts"));
      userRole = mapIdmRoleToAppRole(userRole);
      const state = payload["custom:cms_state"];
      const currentUser = {
        email,
        given_name,
        family_name,
        userRole,
        state,
      };
      setUser(currentUser);
      dispatch(loadUser(currentUser));
    } catch (e) {
      if (idmLoginOnly) {
        authenticateWithIDM();
      } else {
        setShowLocalLogins(true);
      }
    }
  }, [idmLoginOnly, location]);

  // single run configuration
  useEffect(() => {
    Auth.configure({
      mandatorySignIn: true,
      region: config.cognito.REGION,
      userPoolId: config.cognito.USER_POOL_ID,
      identityPoolId: config.cognito.IDENTITY_POOL_ID,
      userPoolWebClientId: config.cognito.APP_CLIENT_ID,
      oauth: {
        domain: config.cognito.APP_CLIENT_DOMAIN,
        redirectSignIn: config.cognito.REDIRECT_SIGNIN,
        redirectSignOut: config.cognito.REDIRECT_SIGNOUT,
        scope: ["email", "openid", "profile"],
        responseType: "code",
      },
    });
  });

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
    }),
    [user, logout, showLocalLogins]
  );

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

export const mapIdmRoleToAppRole = (idmRole) => {
  switch (idmRole) {
    case IdmRoles.APPROVER:
      return AppRoles.CMS_APPROVER;
    case IdmRoles.INTERNAL:
      return AppRoles.INTERNAL_USER;
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
