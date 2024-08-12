import React from "react";
import { Route, Routes } from "react-router-dom";
import CertifyAndSubmit from "./CertifyAndSubmit";
import Homepage from "../sections/homepage/Homepage";
import InvokeSection from "../utils/InvokeSection";
import SaveError from "./SaveError";
import ScrollToTop from "../utils/ScrollToTop";
import Sidebar from "./Sidebar";
import Unauthorized from "./Unauthorized";

const CertifyPage = () => (
  <>
    <Sidebar />
    <CertifyAndSubmit />
  </>
);

const Section = () => (
  <>
    <Sidebar />
    <InvokeSection />
  </>
);

const StateHome = () => {
  return (
    <>
      <Route path="/" />
      <SaveError />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route
          path="/sections/:year/certify-and-submit"
          element={<CertifyPage />}
        />
        <Route
          path="/sections/:year/:sectionOrdinal/:subsectionMarker"
          element={<Section />}
        />
        <Route path="/sections/:year/:sectionOrdinal" element={<Section />} />
        {/* Add routes from admin that should be unauthorized for state users */}
        <Route
          path={[
            "/role_user_assoc",
            "/state_assoc",
            "/role_jobcode_assoc",
            "/users",
          ]}
          element={Unauthorized}
        />
      </Routes>
    </>
  );
};
export default StateHome;
