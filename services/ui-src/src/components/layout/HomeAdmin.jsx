import React from "react";
import { Link } from "react-router-dom";
// components
import CMSHomepage from "../sections/homepage/CMSHomepage";
// utils
import ScrollToTop from "../utils/ScrollToTop";

const AdminHome = () => (
  <>
    <ScrollToTop />
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
  </>
);

export default AdminHome;
