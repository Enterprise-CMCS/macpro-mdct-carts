import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import AdminHome from "./HomeAdmin";
import CMSHome from "./HomeCMS";
import StateHome from "./HomeState";
import Unauthorized from "./Unauthorized";
import { UserRoles } from "../../types";

const Home = ({ user, role }) => {
  // TODO: This is the spot that flickers in the app with unauthorized, find a way to resolve
  let content = null;
  console.log(user)
  console.log(role)

  // TODO: Switch on user role
  switch (role) {
    case UserRoles.ADMIN:
      content = <AdminHome />;
      break;
    case UserRoles.BO:
    case UserRoles.CO:
      content = <CMSHome />;
      break;
    case UserRoles.STATE:
      content = <StateHome />;
      break;
    default:
      {
        content = <Unauthorized />;
      }
      break;
  }
  return (
    <div className="ds-l-container">
      <div className="ds-l-row">{content}</div>
    </div>
  );
};
Home.propTypes = {
  user: PropTypes.object,
  role: PropTypes.string,
};

export default Home;
