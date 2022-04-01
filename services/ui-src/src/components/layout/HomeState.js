import React from "react";
import PropTypes from "prop-types";
import { Switch } from "react-router";
import { Route } from "react-router-dom";
import CertifyAndSubmit from "./CertifyAndSubmit";
import Homepage from "../sections/homepage/Homepage";
import InvokeSection from "../Utils/InvokeSection";
import SaveError from "./SaveError";
import ScrollToTop from "../Utils/ScrollToTop";
import Sidebar from "./Sidebar";
import Unauthorized from "./Unauthorized";

const StateHome = () => {
  return (
    <>
      <Route path="/" />
      <SaveError />
      <ScrollToTop />
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route path="/sections/:year/certify-and-submit" exact>
          <Sidebar />
          <CertifyAndSubmit />
        </Route>
        <Route path="/sections/:year/:sectionOrdinal/:subsectionMarker">
          <Sidebar />
          <InvokeSection />
        </Route>
        <Route path="/sections/:year/:sectionOrdinal">
          <Sidebar />
          <InvokeSection />
        </Route>
        {/* Add routes from admin that should be unauthorized for state users */}
        <Route
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
};
export default StateHome;
