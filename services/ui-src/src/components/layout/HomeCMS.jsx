import React from "react";
import { Routes, Route } from "react-router-dom";
import CMSHomepage from "../sections/homepage/CMSHomepage";
import InvokeSection from "../utils/InvokeSection";
import SaveError from "./SaveError";
import ScrollToTop from "../utils/ScrollToTop";
import Sidebar from "./Sidebar";

const Section = () => (
  <>
    <Sidebar />
    <InvokeSection />
  </>
);

const CMSHome = () => (
  <>
    <SaveError />
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<CMSHomepage />} />
      <Route
        path="/views/sections/:state/:year/:sectionOrdinal/:subsectionMarker"
        element={<Section />}
      />
      <Route
        path="/views/sections/:state/:year/:sectionOrdinal"
        element={<Section />}
      />
    </Routes>
  </>
);

export default CMSHome;
