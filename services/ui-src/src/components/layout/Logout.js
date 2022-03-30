import React from "react";
import { Button } from "@cmsgov/design-system-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../../hooks/authHooks";

// Basic component with logout button
const Logout = () => {
  const { logout } = useUser();

  return (
    <Button type="button" inversed variation="transparent" onClick={logout}>
      <FontAwesomeIcon icon={faSignOutAlt} />
      Log out
    </Button>
  );
};
export default Logout;
