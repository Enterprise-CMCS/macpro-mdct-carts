import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import AdminHome from "./HomeAdmin";
import CMSHome from "./HomeCMS";
import StateHome from "./HomeState";
import Unauthorized from "./Unauthorized";
import IncompleteUser from "./IncompleteUser";

const Home = ({ role, SecureRouteComponent, stateId }) => {
  let content = null;
  console.log("zzzzzzzzz", stateId);
  switch (role) {
    case "admin_user":
      content = <AdminHome SecureRouteComponent={SecureRouteComponent} />;
      break;
    case "bus_user":
    case "co_user":
      content = <CMSHome SecureRouteComponent={SecureRouteComponent} />;
      break;
    case "state_user":
      if (stateId) {
        content = <StateHome SecureRouteComponent={SecureRouteComponent} />;
      } else {
        content = (
          <IncompleteUser SecureRouteComponent={SecureRouteComponent} />
        );
      }
      break;
    default:
      content = <Unauthorized />;
  }

  return (
    <div className="ds-l-container">
      <div className="ds-l-row">{content}</div>
    </div>
  );
};
Home.propTypes = {
  role: PropTypes.oneOf([PropTypes.bool, PropTypes.string]).isRequired,
  stateId: PropTypes.element.isRequired,
  SecureRouteComponent: PropTypes.element.isRequired,
};

const mapState = (state) => ({
  role: state.stateUser?.currentUser?.role,
  stateId: state.stateUser?.currentUser?.state.id,
});

export default connect(mapState)(Home);
