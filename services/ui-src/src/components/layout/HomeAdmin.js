import React from "react";
import PropTypes from "prop-types";
import { Link, Route } from "react-router-dom";
import JobCodeRoleAssociations from "../Utils/JobCodeRoleAssociations";
import StateAssociations from "../Utils/StateAssociations";
import UserRoleAssociations from "../Utils/UserRoleAssociations";
import FormTemplates from "./FormTemplates";
import CMSHomepage from "../sections/homepage/CMSHomepage";
import InvokeSection from "../Utils/InvokeSection";
import Sidebar from "./Sidebar";
import { Switch } from "react-router";
import ScrollToTop from "../Utils/ScrollToTop";
import { connect } from "react-redux";

const AdminHome = () => {
  return (
    <>
      <ScrollToTop />
      <Route exact path="/">
        <main className="homepage ds-l-col--12">
          <div className="ds-l-container">
            <div className="ds-l-row">
              <h1 className="page-title ds-u-margin-bottom--0">
                CHIP Annual Reporting Template System (CARTS)
              </h1>
            </div>
            <div className="ds-l-row">
              <ul>
                <li>
                  <Link to="/templates">Generate Form Base Templates</Link>
                </li>
              </ul>
            </div>
            <div className="cmslist">
              <CMSHomepage />
            </div>
          </div>
        </main>
      </Route>
      <Switch>
        <Route
          exact
          path="/views/sections/:state/:year/:sectionOrdinal/:subsectionMarker"
        >
          <Sidebar />
          <InvokeSection />
        </Route>
        <Route path="/views/sections/:state/:year/:sectionOrdinal">
          <Sidebar />
          <InvokeSection />
        </Route>
        <Route exact path="/state_assoc" component={StateAssociations} />
        <Route exact path="/role_user_assoc" component={UserRoleAssociations} />
        <Route
          exact
          path="/role_jobcode_assoc"
          component={JobCodeRoleAssociations}
        />
        <Route exact path="/state-reports" component={CMSHomepage} />
        <Route exact path="/templates" component={FormTemplates} />
      </Switch>
    </>
  );
};
AdminHome.propTypes = {
  formYear: PropTypes.object.isRequired,
};

export const mapStateToProps = (state) => ({
  currentUser: state.stateUser.currentUser,
  formYear: state.global.formYear,
});

export default connect(mapStateToProps)(AdminHome);
