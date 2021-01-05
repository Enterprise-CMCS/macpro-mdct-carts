import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import JobCodeRoleAssociations from "../Utils/JobCodeRoleAssociations";
import StateAssociations from "../Utils/StateAssociations";
import UserRoleAssociations from "../Utils/UserRoleAssociations";
import Users from "../layout/users/Users";
import UserEdit from "../layout/users/UserEdit";
import AddUser from "../Utils/AddUser";
import CMSHomepage from "../sections/homepage/CMSHomepage";
import InvokeSection from "../Utils/InvokeSection";
import Sidebar from "./Sidebar";
import { Switch } from "react-router";
import ScrollToTop from "../Utils/ScrollToTop";

const AdminHome = ({ SecureRouteComponent: SecureRoute }) => (
  <>
    <ScrollToTop />
    <SecureRoute exact path="/">
      <div className="homepage ds-l-col--12">
        <div className="ds-l-container">
          <div className="ds-l-row">
            <h1 className="page-title ds-u-margin-bottom--0">
              CHIP Annual Report Template System (CARTS)
            </h1>
          </div>
          <div className="page-info">
            <div className="edit-info">admin</div>
          </div>
          <div className="ds-l-row">
            <ul>
              <li>
                <a href="/users">List users</a>
              </li>
              <li>
                <Link to="/add_user">Add user</Link>
              </li>
              <li>
                <Link to="/add_state_user">Add state user</Link>
              </li>
            </ul>
          </div>
          <div className="cmslist">
            <CMSHomepage SecureRouteComponent={SecureRoute} />
          </div>
        </div>
      </div>
    </SecureRoute>
    <Switch>
      <SecureRoute
        exact
        path="/views/sections/:state/:year/:sectionOrdinal/:subsectionMarker"
      >
        <Sidebar />
        <InvokeSection />
      </SecureRoute>
      <SecureRoute path="/views/sections/:state/:year/:sectionOrdinal">
        <Sidebar />
        <InvokeSection />
      </SecureRoute>
      <SecureRoute exact path="/state_assoc" component={StateAssociations} />
      <SecureRoute
        exact
        path="/role_user_assoc"
        component={UserRoleAssociations}
      />
      <SecureRoute
        exact
        path="/role_jobcode_assoc"
        component={JobCodeRoleAssociations}
      />
      <SecureRoute exact path="/users" component={Users} />
      <SecureRoute exact path="/add_user" component={AddUser} />
      <SecureRoute exact path="/user/:id" component={UserEdit} />
      <SecureRoute exact path="/state-reports" component={CMSHomepage} />
    </Switch>
  </>
);
AdminHome.propTypes = {
  SecureRouteComponent: PropTypes.element.isRequired,
};

export default AdminHome;
