import React from "react";
import PropTypes from "prop-types";
import { Switch } from "react-router";

import CMSHomepage from "../sections/homepage/CMSHomepage";
import SaveError from "./SaveError";
import ScrollToTop from "../Utils/ScrollToTop";

const CMSHome = ({ SecureRouteComponent: SecureRoute }) => (
  <>
    <SecureRoute path="/" />
    <SaveError />
    <ScrollToTop />
    <Switch>
      <SecureRoute exact path="/" component={CMSHomepage} />
    </Switch>
  </>
);

CMSHome.propTypes = {
  SecureRouteComponent: PropTypes.element.isRequired,
};

export default CMSHome;
