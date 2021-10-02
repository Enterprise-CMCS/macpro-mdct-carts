import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import AdminHome from "./HomeAdmin";
import CMSHome from "./HomeCMS";
import StateHome from "./HomeState";
import Unauthorized from "./Unauthorized";
import LocalLogins from "../sections/login/LocalLogins";

const { env } = window;
const Home = ({ role, loggedIn, SecureRouteComponent }) => {
  let content = null;
  switch (role) {
    case "admin_user":
      content = <AdminHome SecureRouteComponent={SecureRouteComponent} />;
      break;
    case "bus_user":
    case "co_user":
      content = <CMSHome SecureRouteComponent={SecureRouteComponent} />;
      break;
    case "state_user":
      content = <StateHome SecureRouteComponent={SecureRouteComponent} />;
      break;
    default:
      {
        content =
          !loggedIn && env.ENABLE_LOCAL_LOGIN === "true" ? (
            <LocalLogins />
          ) : (
            <Unauthorized />
          );
      }
      break;
  }
  return <div className="ds-l-container">{content}</div>;
};
Home.propTypes = {
  role: PropTypes.oneOf([PropTypes.bool, PropTypes.string]).isRequired,
  SecureRouteComponent: PropTypes.element.isRequired,
  loggedIn: PropTypes.element.isRequired,
};

const mapState = (state) => ({
  role: state.stateUser?.currentUser?.role,
  loggedIn: !!state.stateUser?.currentUser?.username,
});

export default connect(mapState)(Home);
