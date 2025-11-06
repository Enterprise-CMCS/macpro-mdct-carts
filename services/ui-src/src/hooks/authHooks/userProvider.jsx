import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import { UserContext } from "./userContext";
import { AppRoles, IdmRoles } from "../../types";
import { loadUser } from "../../actions/initial";
import { useDispatch } from "react-redux";
import config from "../../config";
import { authenticateWithIDM, getTokens, logoutUser } from "../../util/apiLib";

const cartsProdDomain = "https://mdctcarts.cms.gov";
const tempEndpoint = "https://dt4brcxdimpa0.cloudfront.net";

export const UserProvider = ({ children }) => {
  const location = useLocation();
  const isProduction =
    window.location.origin === cartsProdDomain ||
    window.location.origin === tempEndpoint;
  const dispatch = useDispatch();

  const [user, setUser] = useState(null);
  const [showLocalLogins, setShowLocalLogins] = useState(false);

  const logout = useCallback(async () => {
    try {
      setUser(null);
      localStorage.removeItem("mdctcarts_session_exp");
      await logoutUser();
    } catch (error) {
      console.log("error signing out: ", error); // eslint-disable-line no-console
    }
  }, []);

  const checkAuthState = useCallback(async () => {
    // Allow Post Logout flow alongside user login flow
    if (location?.pathname.toLowerCase() === "/postlogout") {
      window.location.href = config.POST_SIGNOUT_REDIRECT;
      return;
    }

    // Authenticate
    try {
      const tokens = await getTokens();
      if (!tokens?.idToken) {
        throw new Error("Missing tokens auth session.");
      }
      const payload = tokens.idToken.payload;
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
      if (isProduction) {
        await authenticateWithIDM();
      } else {
        setShowLocalLogins(true);
      }
    }
  }, [isProduction, location]);

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
