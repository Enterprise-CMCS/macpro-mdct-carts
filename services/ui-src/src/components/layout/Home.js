import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import AdminHome from "./HomeAdmin";
import CMSHome from "./HomeCMS";
import StateHome from "./HomeState";
import Unauthorized from "./Unauthorized";
import { UserRoles } from "../../types";
import { getHello } from "../../actions/hello";

const Home = ({ user, role, getHello: helloAction }) => {
  let content = null;
  helloAction();

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
  user: PropTypes.object,
  role: PropTypes.string,
};

const mapState = (state) => ({});
const mapDispatch = { getHello };
export default connect(mapState, mapDispatch)(Home);
