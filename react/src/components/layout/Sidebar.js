import React, { Component } from "react";
import StateHeader from "./StateHeader";
import TOC from "./TOC";

class Sidebar extends Component {
  render() {
    return (
      <div className="sidebar-inner">
        <StateHeader />
        <TOC />
      </div>
    );
  }
}

export default Sidebar;
