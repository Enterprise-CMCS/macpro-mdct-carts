import React from "react";
import PropTypes from "prop-types";
import AdminHome from "./HomeAdmin";
import CMSHome from "./HomeCMS";
import StateHome from "./HomeState";
import Unauthorized from "./Unauthorized";
import { AppRoles } from "../../types";

const Home = ({ role }) => {
  let content = null;

  switch (role) {
    case AppRoles.CMS_ADMIN:
      content = <AdminHome />;
      break;
    case AppRoles.CMS_USER:
    case AppRoles.HELP_DESK:
      content = <CMSHome />;
      break;
    case AppRoles.CMS_APPROVER:
      content = <CMSHome />;
      break;
    case AppRoles.STATE_USER:
      content = <StateHome />;
      break;
    default:
      content = <Unauthorized />;
      break;
  }
  return (
    <div className="ds-l-container">
      <div className="ds-l-row">{content}</div>
    </div>
  );
};
Home.propTypes = {
  role: PropTypes.string,
};

export default Home;
