import React from "react";
import { useOktaAuth } from "@okta/okta-react";
import { Button } from "@cmsgov/design-system-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import config from "../../auth-config";

const redirectUri = `${window.location.origin}`;

// Basic component with logout button
const Logout = () => {
  const isOktaAuth = useOktaAuth();
  const localUserPrefix = "localLoggedin-";
  const loginInfo = localStorage.getItem("loginInfo") || "";
  const logout = async () => {
    const { authState, authService } = isOktaAuth;
    // Read idToken before local session is cleared
    const { idToken } = authState;
    localStorage.removeItem("loginInfo");
    await authService.logout("/");

    // Clear remote session
    if (idToken) {
      window.location.href = `${config.oidc.issuer}/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${redirectUri}`;
    } else {
      /* eslint-disable no-undef */
      window.location.href = `${window.env.OIDC_ISSUER_URL}/login/signout?fromURI=${redirectUri}`;
    }
  };

  const localLogout = () => {
    localStorage.removeItem("loginInfo");
    window.location.href = window.location.href.replace(
      window.location.pathname,
      ""
    );
  };
  return (
    <Button
      type="button"
      inversed
      variation="transparent"
      onClick={loginInfo.indexOf(localUserPrefix) >= 0 ? localLogout : logout}
    >
      <FontAwesomeIcon icon={faSignOutAlt} />
      Log out
    </Button>
  );
};

export default Logout;
