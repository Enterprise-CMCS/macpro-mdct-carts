import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import AdminHome from "./HomeAdmin";
import CMSHome from "./HomeCMS";
import StateHome from "./HomeState";

const Home = ({ role, SecureRouteComponent }) => {
  let content = null;
  role = "bus_user"
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
      content = null;
  }

  return (
    <div className="ds-l-container">
      <div className="ds-l-row">{content}</div>
    </div>
  );
};
Home.propTypes = {
  role: PropTypes.oneOf([PropTypes.bool, PropTypes.string]).isRequired,
  SecureRouteComponent: PropTypes.element.isRequired,
};

const mapState = (state) => ({
  role: state.stateUser?.currentUser?.role,
});

export default connect(mapState)(Home);
