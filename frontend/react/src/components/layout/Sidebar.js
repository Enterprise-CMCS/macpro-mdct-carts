import React, { Component } from "react";
import StateHeader from "./StateHeader";
import TOC from "./TOC-dynamic";

class Sidebar extends Component {
  render() {
    return (
      <div className="sidebar ds-l-col--3">
        <StateHeader />
        <TOC />
      </div>
    );
  }
}

export default Sidebar;
