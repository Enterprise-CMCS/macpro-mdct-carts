import React from "react";
import PropTypes from "prop-types";
import AdminHome from "./HomeAdmin";
import CMSHome from "./HomeCMS";
import StateHome from "./HomeState";
import Unauthorized from "./Unauthorized";
import { UserRoles } from "../../types";

const Home = ({ role }) => {
  let content = null;

  switch (role) {
    case UserRoles.ADMIN:
      content = <AdminHome />;
      break;
    case UserRoles.BO:
    case UserRoles.CO:
    case UserRoles.HELP:
      content = <CMSHome />;
      break;
    case UserRoles.STATE:
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
