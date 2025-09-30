import React from "react";
import { Link } from "react-router";
// components
import { Main } from "./Main";
import CMSHomepage from "../sections/homepage/CMSHomepage";
// utils
import ScrollToTop from "../utils/ScrollToTop";

const AdminHome = () => (
  <>
    <ScrollToTop />
    <Main className="homepage ds-l-col--12">
      <div className="ds-l-container">
        <div className="ds-l-row ds-u-padding-left--2">
          <h1 className="page-title ds-u-margin-bottom--0">
            CHIP Annual Reporting Template System (CARTS)
          </h1>
        </div>
        <div className="ds-l-row">
          <div className="ds-l-col--12 ds-u-margin-top--2">
            <Link to="/templates">Generate Form Base Templates</Link>
          </div>
        </div>
        <div className="cmslist">
          <CMSHomepage />
        </div>
      </div>
    </Main>
  </>
);

export default AdminHome;
