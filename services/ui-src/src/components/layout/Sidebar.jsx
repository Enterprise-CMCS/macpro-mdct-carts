import React from "react";
import StateHeader from "./StateHeader";
import TableOfContents from "./TableOfContents";

const Sidebar = () => (
  <div className="sidebar ds-l-col--3">
    <div className="skip-content">
      <a href="#main-content">Skip to main content</a>
    </div>
    <StateHeader />
    <TableOfContents />
  </div>
);

export default Sidebar;
