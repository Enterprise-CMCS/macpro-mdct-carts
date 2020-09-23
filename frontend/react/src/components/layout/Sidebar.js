import React from "react";
import StateHeader from "./StateHeader";
import TOC from "./TOC";

const Sidebar = () => (
  <div className="sidebar ds-l-col--3">
    <StateHeader />
    <TOC />
  </div>
);

export default Sidebar;
