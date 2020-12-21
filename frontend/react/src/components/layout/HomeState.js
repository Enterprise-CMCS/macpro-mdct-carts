import React from "react";
import PropTypes from "prop-types";
import { Switch } from "react-router";

import CertifyAndSubmit from "./CertifyAndSubmit";
import Homepage from "../sections/homepage/Homepage";
import InvokeSection from "../Utils/InvokeSection";
import SaveError from "./SaveError";
import ScrollToTop from "../Utils/ScrollToTop";
import Sidebar from "./Sidebar";
import Unauthorized from "./Unauthorized";

const StateHome = ({ SecureRouteComponent: SecureRoute }) => (
  <>
    <SecureRoute path="/" />
    <SaveError />
    <ScrollToTop />
    <Switch>
      <SecureRoute exact path="/" component={Homepage} />

      <SecureRoute path="/sections/:year/certify-and-submit" exact>
        <Sidebar />
        <CertifyAndSubmit />
      </SecureRoute>
      <SecureRoute path="/sections/:year/:sectionOrdinal/:subsectionMarker">
        <Sidebar />
        <InvokeSection />
      </SecureRoute>
      <SecureRoute path="/sections/:year/:sectionOrdinal">
        <Sidebar />
        <InvokeSection />
      </SecureRoute>
      {/* Add routes from admin that should be unauthorized for state users */}
      <SecureRoute
        path={[
          "/role_user_assoc",
          "/state_assoc",
          "/role_jobcode_assoc",
          "/users",
        ]}
        component={Unauthorized}
      />
    </Switch>
  </>
);
StateHome.propTypes = {
  SecureRouteComponent: PropTypes.element.isRequired,
};

export default StateHome;
