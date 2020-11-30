import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import JobCodeRoleAssociations from "../Utils/JobCodeRoleAssociations";
import StateAssociations from "../Utils/StateAssociations";
import UserRoleAssociations from "../Utils/UserRoleAssociations";
import Users from "../layout/users/Users";

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
                <Link to="/state_assoc">
                  Associate usernames (EUA IDs) to states
                </Link>
              </li>
              <li>
                <Link to="/role_user_assoc">
                  Associate usernames (EUA IDs) to CARTS roles
                </Link>
              </li>
              <li>
                <Link to="/role_jobcode_assoc">
                  Associate EUA job codes to CARTS roles
                </Link>
              </li>
              <li>
                <Link to="/users">List and edit all users</Link>
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
  </>
);
AdminHome.propTypes = {
  SecureRouteComponent: PropTypes.element.isRequired,
};

export default AdminHome;
