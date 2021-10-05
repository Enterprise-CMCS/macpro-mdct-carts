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

  if (isOktaAuth) {
    const { authState, authService } = isOktaAuth;

    const logout = async () => {
      // Read idToken before local session is cleared
      const { idToken } = authState;
      await authService.logout("/");

      // Clear remote session
      if (idToken) {
        window.location.href = `${config.oidc.issuer}/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${redirectUri}`;
      } else {
        /* eslint-disable no-undef */
        window.location.href = `${window.env.OIDC_ISSUER_URL}/login/signout?fromURI=${redirectUri}`;
      }
    };

    return (
      <Button type="button" inversed variation="transparent" onClick={logout}>
        <FontAwesomeIcon icon={faSignOutAlt} />
        Log out
      </Button>
    );
  }
  return <span>Not Okta User</span>;
};

export default Logout;
