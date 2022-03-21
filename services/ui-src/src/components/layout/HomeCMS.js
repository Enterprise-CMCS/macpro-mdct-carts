import React from "react";
import PropTypes from "prop-types";
import { Switch } from "react-router";

import CMSHomepage from "../sections/homepage/CMSHomepage";
import InvokeSection from "../Utils/InvokeSection";
import SaveError from "./SaveError";
import ScrollToTop from "../Utils/ScrollToTop";
import Sidebar from "./Sidebar";
import Unauthorized from "./Unauthorized";

const CMSHome = ({ SecureRouteComponent: SecureRoute }) => (
  <>
    <SaveError />
    <ScrollToTop />
    <Switch>
      <SecureRoute exact path="/" component={CMSHomepage} />
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
      {/* Add routes from admin that should be unauthorized for cms users */}
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

CMSHome.propTypes = {
  SecureRouteComponent: PropTypes.element.isRequired,
};

export default CMSHome;
