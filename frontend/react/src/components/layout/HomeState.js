import React from "react";
import PropTypes from "prop-types";
import { Switch } from "react-router";

import CertifyAndSubmit from "./CertifyAndSubmit";
import Homepage from "../sections/homepage/Homepage";
import InvokeSection from "../Utils/InvokeSection";
import SaveError from "./SaveError";
import ScrollToTop from "../Utils/ScrollToTop";
import Sidebar from "./Sidebar";

const StateHome = ({ SecureRouteComponent: SecureRoute }) => (
  <>
    <SecureRoute path="/" />
    <SaveError />
    <ScrollToTop />
    <Switch>
      <SecureRoute exact path="/" component={Homepage} />

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
    </Switch>
  </>
);
StateHome.propTypes = {
  SecureRouteComponent: PropTypes.element.isRequired,
};

export default StateHome;
