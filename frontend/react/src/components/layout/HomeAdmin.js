import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import JobCodeRoleAssociations from "../Utils/JobCodeRoleAssociations";
import StateAssociations from "../Utils/StateAssociations";
import UserRoleAssociations from "../Utils/UserRoleAssociations";
import Users from "../layout/users/Users";
import AddUser from "../Utils/AddUser";

const AdminHome = ({ SecureRouteComponent: SecureRoute }) => (
  <>
    <SecureRoute exact path="/">
      <div className="homepage">
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
            </ul>
          </div>
        </div>
      </div>
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
  </>
);
AdminHome.propTypes = {
  SecureRouteComponent: PropTypes.element.isRequired,
};

export default AdminHome;
