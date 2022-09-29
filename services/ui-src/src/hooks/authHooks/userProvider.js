import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Auth } from "aws-amplify";
import { UserContext } from "./userContext";
import { AppRoles, IdmRoles } from "../../types";
import { loadUser } from "../../actions/initial";
import { useDispatch } from "react-redux";
import config from "../../config";

const cartsProdDomain = "https://mdctcarts.cms.gov";
const tempEndpoint = "https://dt4brcxdimpa0.cloudfront.net";

const authenticateWithIDM = () => {
  Auth.federatedSignIn({ customProvider: "Okta" });
};

export const UserProvider = ({ children }) => {
  const history = useHistory();
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
      await Auth.signOut();
    } catch (error) {
      console.log("error signing out: ", error); // eslint-disable-line no-console
    }
    history.push("/");
  }, [history]);

  const checkAuthState = useCallback(async () => {
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
      if (isProduction) {
        authenticateWithIDM();
      } else {
        setShowLocalLogins(true);
      }
    }
  }, [isProduction]);

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
